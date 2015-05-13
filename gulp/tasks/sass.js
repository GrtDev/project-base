//@formatter:off

var gulp                    = require('gulp');
var browserSync             = require('browser-sync');
var sass                    = require('gulp-sass');
var sourcemaps              = require('gulp-sourcemaps');
var handleErrors            = require('../util/handleErrors');
var config                  = require('../config');
var autoprefixer            = require('gulp-autoprefixer');
var gulpif                  = require('gulp-if');

//@formatter:on

/**
 * Task for compiled SASS files back to CSS, uses lib-sass instead of ruby for faster compiling.
 * @see https://www.npmjs.com/package/gulp-sass
 * @see http://libsass.org/
 */
gulp.task('sass', function () {


    var options = {

        source:     config.source.getPath('css', '*.scss'),
        dest:       config.dest.getPath('css'),
        sourcemaps: config.debug, // only include source maps in debug mode.

        settings: {
            //indentedSyntax: true, // Enable .sass syntax!
            //imagePath: 'images' // Used by the image-url helper
        },

        autoprefixer: {
            browsers: ['last 3 versions']
        }

    };


    return gulp.src(options.source)
        .on('error', handleErrors)
        //
        .pipe(gulpif(options.sourcemaps, sourcemaps.init()))
        .pipe(sass(options.settings))
        .pipe(gulpif(options.sourcemaps, sourcemaps.write()))
        //
        .pipe(autoprefixer(options.autoprefixer))
        .pipe(gulp.dest(options.dest))
        .pipe(browserSync.reload({stream: true}));

});

