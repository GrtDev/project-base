// @formatter:off
var gulp            = require('gulp');
var browserSync     = require('browser-sync');
var sass            = require('gulp-sass');
var sourcemaps      = require('gulp-sourcemaps');
var handleErrors    = require('../util/handleErrors');
var autoprefixer    = require('gulp-autoprefixer');
var config          = require('../config');
var sassConfig      = config.sass;
var cssminConfig    = config.cssmin;
var gulpif          = require('gulp-if');
var minifyCSS       = require('gulp-minify-css');
// @formatter:on

gulp.task('sass', ['images'], function () {
    return gulp.src(sassConfig.source)

        .pipe(gulpif(sassConfig.debug, sourcemaps.init()))
        .pipe(sass(sassConfig.settings))
        .on('error', handleErrors)
        .pipe(gulpif(sassConfig.debug, sourcemaps.write()))

        .pipe(autoprefixer(sassConfig.autoprefixer)) // run prefixer

        .pipe(gulpif(sassConfig.minify, minifyCSS(cssminConfig))) // minify if needed

        .pipe(gulp.dest(sassConfig.dest))
        .pipe(browserSync.reload({stream: true}));
});


