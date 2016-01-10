var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    _ = require('lodash'),
    ngAnnotate = require('gulp-ng-annotate'),
    fs = require('fs'),
    translations = require('./public/languages/translations.json');

function handleError(err) {
    gutil.log(err.toString());
    this.emit('end');
}

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

gulp.task('default', ['app-less', 'outer-less', 'split-translations']);
