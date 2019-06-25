const gulp = require("gulp");
const sass = require("gulp-sass");
const path = require("path");
const gutil = require("gulp-util");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");
const stream = require("stream");
const es = require("event-stream");
const _ = require("lodash");
const ngAnnotate = require("gulp-ng-annotate");
const fs = require("fs");
const jade = require("gulp-jade");
const translations = require("./public/languages/translations.json");
const scriptsDest = "public/app";
const watch = gulp.watch;

sass.compiler = require('node-sass');

const jadePath = "./app/views/**/*.jade";
const themePath = "./public/purpose-theme/scss/custom/**/*.scss";
const stylesPath = "./public/styles/scss/styles.scss";
const stylesWatch = [stylesPath, themePath];
const outerStylesPath = "./public/styles/scss/styles-outer.scss";
const outerStylesWatch = [outerStylesPath, themePath]

function handleError(err) {
    gutil.log(err.toString());
    this.emit("end");
}

function fetchScripts(filename) {
    return fs.readFileSync(filename, "utf8").split(/\r?\n/)
        .map((row) => {
            if(row.startsWith("script")) {
                return "./public" + row.match(/src=["|'](.*?)["|']/)[1];
            }
            return "";
        })
        .filter((value) => !!value);
}

const compileJade = (cb) => {
    const locals = {
        env: "production",
        envInstance: "production"
    };

    gulp.src(jadePath)
        .pipe(jade({ locals }))
        .pipe(gulp.dest("./app/views/dist/"));

    if (cb) {
        cb();
    }
}
gulp.task("compile-jade", compileJade);

function generateProductionScripts(scriptName, appScriptsPath, packageScriptsPath) {
    return es.merge(
            gulp.src(packageScriptsPath),
            gulp.src(appScriptsPath)
                .pipe(ngAnnotate())
                .pipe(babel())
        )
        .pipe(concat(scriptName))
        .pipe(gulp.dest(scriptsDest))
        .pipe(rename(scriptName))
        .pipe(uglify())
        .pipe(gulp.dest(scriptsDest));
}

gulp.task("production-scripts", function() {
    let trafieScripts = fetchScripts("./app/views/partials/scripts.jade"),
        packageScripts = fetchScripts("./app/views/partials/scripts-packages.jade"),
        scriptName = "trafie.min.js";    
    return generateProductionScripts(scriptName, trafieScripts, packageScripts);

});

gulp.task("production-outer-scripts", function() {
    let outerScripts = fetchScripts("./app/views/partials/scripts-outer.jade"),
        outerPackageScripts = fetchScripts("./app/views/partials/scripts-packages-outer.jade"),
        scriptName = "trafieOuter.min.js";
    return generateProductionScripts(scriptName, outerScripts, outerPackageScripts);
});

const appScss = (cb) => {
    gulp.src(stylesPath)
        .pipe(sass().on("error", handleError))
        .pipe(rename("./"))
        .pipe(gulp.dest("./public/styles/styles.css"));

    if (cb) {
        cb();
    }
}
gulp.task("app-scss", appScss);

const outerScss = (cb) => {
    gulp.src(outerStylesPath)
        .pipe(sass().on("error", handleError))
        .pipe(rename("./"))
        .pipe(gulp.dest("./public/styles/styles-outer.css"));

    if (cb) {
        cb();
    }
}
gulp.task("outer-scss", outerScss);

gulp.task("watch", () => {
    watch(jadePath, compileJade);
    watch(stylesPath, appScss);
    watch(outerStylesPath, outerScss);
    watch(themePath, appScss);
    watch(themePath, outerScss);
});

gulp.task("split-translations", function(cb) {
    _.each(translations.LANGUAGE.SHORT_NAME, function(language) {
        var json = _.mapValues(translations, function(category) {
            return _.mapValues(category, language);
        });
        fs.writeFileSync("./public/languages/" + language + ".json", JSON.stringify(json));
    });
    cb();
});

gulp.task("default-dev", gulp.series("app-scss", "outer-scss", "split-translations"));
gulp.task("default", gulp.series("production-scripts", "production-outer-scripts", "app-scss", "outer-scss", "split-translations"));
