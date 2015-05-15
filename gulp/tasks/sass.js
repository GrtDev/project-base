//@formatter:off

var config                  = require('../config');
var handleErrors            = require('../util/handleErrors');
var humanFileSize           = require('../util/humanFileSize');

var gulp                    = require('gulp');
var gulpUtil                = require('gulp-util');
var browserSync             = require('browser-sync');
var sass                    = require('gulp-sass');
var sourcemaps              = require('gulp-sourcemaps');
var autoprefixer            = require('gulp-autoprefixer');
var gulpIf                  = require('gulp-if');
var gulpMinCss              = require('gulp-minify-css');
var gulpSize                = require('gulp-size');
var uncss                   = require('gulp-uncss');

//@formatter:on

/**
 * Task for compiled SASS files back to CSS, uses lib-sass instead of ruby for faster compiling.
 * Depending on the settings it will also remove unused CSS lines, add source maps and minify the output.
 *
 * @see https://www.npmjs.com/package/gulp-sass
 * @see http://libsass.org/
 */
gulp.task('sass', function () {


    var options = {

        source: config.source.getPath('css', '*.scss'),
        dest: config.dest.getPath('css'),
        sourcemaps: config.debug, // only include source maps in debug mode.


        sass: {
            //indentedSyntax: true, // Enable .sass syntax!
            //imagePath: 'images' // Used by the image-url helper
        },

        // Plugin to parse CSS and add vendor prefixes using values from Can I Use.
        // @see: http://caniuse.com/
        // @see: https://github.com/postcss/autoprefixer-core
        autoprefixer: {
            browsers: ['last 3 versions'],
            remove: true // By default, Autoprefixer will not only add new prefixes, but also remove outdated.
        },

        // Clean CSS is responsible for minifying the CSS
        // @see: https://github.com/jakubpawlowicz/clean-css
        minify: config.minify,
        cleanCSS: {
            aggressiveMerging: true,        // set to false to disable aggressive merging of properties.
            keepSpecialComments: 0,         // * for keeping all (default), 1 for keeping first one only, 0 for removing all
            mediaMerging: true,             // whether to merge @media blocks (default is true)
            rebase: false,                  // set to false to skip URL rebasing
            relativeTo: undefined,          // path to resolve relative @import rules and URLs
            root: undefined                 // path to resolve absolute @import rules and rebase relative URLs
        },

        // UnCSS crawls the HTML and removes any unused CSS selectors and styling.
        // it uses PhantomJS to try to run JavaScript files.
        // @see: https://github.com/giakki/uncss
        removeUnused: true,
        uncss: {
            html: config.dest.getPath('markup', '**/*.html'),
            // provide a list of selectors that should not be removed by UnCSS. For example, styles added by user interaction with the page (hover, click),
            ignore: ['.active', '.open', '.selected']
        }

    };

    // Keep track of the file size changes
    // @see: https://github.com/sindresorhus/gulp-size
    var sizeBefore = gulpSize({showFiles: true});
    var sizeAfter = gulpSize({showFiles: true});

    return gulp.src(options.source)
        //
        .on('error', handleErrors)
        //
        .pipe(gulpIf(options.sourcemaps,    sourcemaps.init()))
        // sass
        .pipe(sass(options.sass))
        // start optimizing...
        .pipe(sizeBefore)
        .pipe(gulpIf(options.removeUnused,  uncss(options.uncss)))
        .pipe(gulpIf(options.minify,        gulpMinCss(options.cleanCSS)))
        .pipe(gulpIf(options.sourcemaps,    sourcemaps.write()))
        .pipe(sizeAfter)
        //
        .pipe(autoprefixer(options.autoprefixer))
        .pipe(gulp.dest(options.dest))
        .on('end', function () { gulpUtil.log('Total size: ' + sizeAfter.prettySize + ', ( saved ' + gulpUtil.colors.cyan(humanFileSize(sizeBefore.size - sizeAfter.size, true)) + ' )'); })
        .pipe(browserSync.reload({stream: true}));

});



