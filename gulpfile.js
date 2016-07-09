var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    babel = require("gulp-babel"),
    es = require('event-stream')
    _ = require('lodash'),
    ngAnnotate = require('gulp-ng-annotate'),
    fs = require('fs'),
    translations = require('./public/languages/translations.json'),
    scriptsDest = 'public/app';

function handleError(err) {
    gutil.log(err.toString());
    this.emit('end');
}

function fetchScripts(filename) {
    return fs.readFileSync(filename, 'utf8').split(/\r?\n/)
        .map((row) => {
            if(row.startsWith('script')) {
                return './public' + row.match(/src=["|'](.*?)["|']/)[1];
            }
            return '';
        })
        .filter((value) => !!value);
}

function generateProductionScripts(scriptName, appScriptsPath, packageScriptsPath) {
    return es.merge(
        gulp.src(appScriptsPath)
            .pipe(ngAnnotate())
            .pipe(babel()),
        gulp.src(packageScriptsPath)
        )
        .pipe(concat(scriptName))
        .pipe(gulp.dest(scriptsDest))
        .pipe(rename(scriptName))
        .pipe(uglify())
        .pipe(gulp.dest(scriptsDest));
}

gulp.task('production-scripts', function() {
    let trafieScripts = fetchScripts('./app/views/partials/scripts.jade'),
        packageScripts = fetchScripts('./app/views/partials/scripts-packages.jade'),
        scriptName = 'trafie.min.js';
    generateProductionScripts(scriptName, trafieScripts, packageScripts);

});

gulp.task('production-outer-scripts', function() {
    let outerScripts = fetchScripts('./app/views/partials/scripts-outer.jade'),
        outerPackageScripts = fetchScripts('./app/views/partials/scripts-packages-outer.jade'),
        scriptName = 'trafieOuter.min.js';
    generateProductionScripts(scriptName, outerScripts, outerPackageScripts);
});

gulp.task('app-less', function () {
    return gulp.src('./public/styles/less/styles.less')
        .pipe(less().on('error', handleError))
        .pipe(rename('./'))
        .pipe(gulp.dest('./public/styles/styles.css'));
});

gulp.task('outer-less', function () {
    return gulp.src('./public/styles/less/styles-outer.less')
        .pipe(less().on('error', handleError))
        .pipe(rename('./'))
        .pipe(gulp.dest('./public/styles/styles-outer.css'));
});

gulp.task('split-translations', function() {
    _.each(translations.LANGUAGE.SHORT_NAME, function(language) {
        var json = _.mapValues(translations, function(category) {
            return _.mapValues(category, language);
        });
        fs.writeFileSync('./public/languages/' + language + '.json', JSON.stringify(json));
    });
});

gulp.task('default-dev', ['app-less', 'outer-less', 'split-translations']);
gulp.task('default', ['production-scripts', 'production-outer-scripts', 'app-less', 'outer-less', 'split-translations']);
