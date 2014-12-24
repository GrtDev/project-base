// @formatter:off

var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var handleErrors = require('../util/handleErrors');
var config       = require('../config').sass;
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', ['images'], function () {
    return gulp.source(config.source)
        .pipe(sourcemaps.init())
        .pipe(sass(config.settings))
        .on('error', handleErrors)
        .pipe(sourcemaps.write())
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({stream:true}));
});

// @formatter:on
