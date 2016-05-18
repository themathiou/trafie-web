var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
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

gulp.task('production-scripts', function() {
    var mainScripts = fetchScripts('./app/views/partials/scripts.jade');
    return gulp.src(mainScripts)
        .pipe(ngAnnotate())
        .pipe(concat('trafie.min.js'))
        .pipe(gulp.dest(scriptsDest))
        .pipe(rename('trafie.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(scriptsDest));
});

gulp.task('production-outer-scripts', function() {
    var outerScripts = fetchScripts('./app/views/partials/scripts-outer.jade');
    return gulp.src(outerScripts)
        .pipe(ngAnnotate())
        .pipe(concat('trafieOuter.min.js'))
        .pipe(gulp.dest(scriptsDest))
        .pipe(rename('trafieOuter.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(scriptsDest));
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

gulp.task('default', ['production-scripts', 'production-outer-scripts', 'app-less', 'outer-less', 'split-translations']);
