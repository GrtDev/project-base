//@formatter:off

var gulp                    = require('gulp');
var browserSync             = require('browser-sync');
var sass                    = require('gulp-sass');
var sourcemaps              = require('gulp-sourcemaps');
var handleErrors            = require('../util/handleErrors');
var config                  = require('../config');
var autoprefixer            = require('gulp-autoprefixer');

//@formatter:on


gulp.task('sass', function () {


    var options = {

        source: config.source.css + '/*.scss',
        dest: config.dest.css,
        debug: config.debug,

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
        .pipe(gulpif(options.debug, sourcemaps.init()))
        .pipe(sass(options.settings))
        .pipe(gulpif(options.debug, sourcemaps.write()))
        //
        .pipe(autoprefixer(options.autoprefixer))
        .pipe(gulp.dest(options.dest))
        .pipe(browserSync.reload({stream: true}));

});

