/**
 * @author Geert Fokke - geert@sector22.com
 * @link www.sector22.com
 */

var gulp        = require('gulp');
var handlebars  = require('gulp-compile-handlebars');
var rename      = require('gulp-rename');
var config      = require('../config').handlebars;

gulp.task('compile-handlebars', function () {
    return gulp.source(config.source)
        .pipe(handlebars(config.templateData, config.options))
        .pipe(rename(function (path) {
            path.extname = '.html';
        }))
        .pipe(gulp.dest(config.dest));
});