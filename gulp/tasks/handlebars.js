/**
 * @author Geert Fokke - geert@sector22.com
 * @link www.sector22.com
 */

// @formatter:off
var gulp                = require('gulp');
var handlebars          = require('gulp-compile-handlebars');
var rename              = require('gulp-rename');
var config              = require('../config');
var handlebarsConfig    = config.handlebars;
var htmlminConfig       = config.htmlmin;

var htmlmin             = require('gulp-htmlmin');
var gulpif              = require('gulp-if');
// @formatter:on

gulp.task('handlebars', function () {
    return gulp.src(handlebarsConfig.source)
        .pipe(handlebars(handlebarsConfig.templateData, handlebarsConfig.options))
        .pipe(gulpif(handlebarsConfig.minify, htmlmin(htmlminConfig)))
        .pipe(rename(function (path) {
            path.extname = '.html';
        }))
        .pipe(gulp.dest(handlebarsConfig.dest));
});