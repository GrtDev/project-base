/**
 * Created by gfokke on 14/11/14.
 */
var gulp = require('gulp');
var prettify = require('gulp-prettify');
var config = require('../config.js').prettify;

gulp.task('prettify', function() {
    gulp.source(config.source + '/*.html')
        .pipe(prettify({indent_size: 2, brace_style:'collapse'}))
        .pipe(gulp.dest(config.dest))
});