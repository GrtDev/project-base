/**
 * @author Geert Fokke - geert@sector22.com
 * @www www.sector22.com
 */

var gulp = require('gulp');
var prettify = require('gulp-prettify');
var config = require('../config.js').prettify;

gulp.task('prettify', function() {
    gulp.source(config.source + '/*.html')
        .pipe(prettify(config.options))
        .pipe(gulp.dest(config.dest))
});