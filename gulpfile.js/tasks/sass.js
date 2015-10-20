//@formatter:off

var requireCachedModule         = require('../util/requireCachedModule');
var config                      = require('../config');
var log                         = require('../util/log');
var path                        = require('path');

var gulp                        = requireCachedModule('gulp');
var browserSync                 = requireCachedModule('browser-sync');
var sass                        = requireCachedModule('gulp-sass');
var sourcemaps                  = requireCachedModule('gulp-sourcemaps');
var autoprefixer                = requireCachedModule('gulp-autoprefixer');
var gulpIf                      = requireCachedModule('gulp-if');
var gulpMinCss                  = requireCachedModule('gulp-minify-css');
var gulpSize                    = requireCachedModule('gulp-size');
var uncss                       = requireCachedModule('gulp-uncss');
var gulpIgnore                  = requireCachedModule('gulp-ignore');

/**
 * Task for compiled SASS files back to CSS, uses lib-sass instead of ruby for faster compiling.
 * Depending on the settings it will also remove unused CSS lines, add source maps and minify the output.
 *
 * @see https://www.npmjs.com/package/gulp-sass
 * @see http://libsass.org/
 * @see: https://github.com/sindresorhus/gulp-size
 */
gulp.task('sass', function () {
    
    var options = {

        sass: {
            // indentedSyntax: true,     // Enable .sass syntax!
            // imagePath: 'images'       // Used by the image-url helper
            errLogToConsole: false,
            onError: log.error           // Also pass the error handler to Sass to catch internal errors
        },

        // Plugin to parse CSS and add vendor prefixes using values from Can I Use.
        // @see: http://caniuse.com/
        // @see: https://github.com/postcss/autoprefixer-core
        autoprefixer: {
            browsers: ['last 3 versions'],
            remove: true // By default, Autoprefixer will not only add new prefixes, but also remove outdated ones.
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
        removeUnused: config.cleanCSS,
        uncss: {
            html: [config.dest.getPath('html', '*.html')],
            // Provide a list of selectors that should not be removed by UnCSS. For example, styles added by user interaction with the page (hover, click),
            // Both literal names and regex patterns are recognized.
            ignore: [ /\.modal.*/, /\.panel.*/, /\.popup.*/, /.*\.is-.*/ ]
            //timeout: 0 //  Specify how long to wait for the JS to be loaded.
        }

    };


    //@formatter:on

    // Keep track of the file size changes
    var sizeBefore = gulpSize( { showFiles: true } );
    var sizeAfter = gulpSize( { showFiles: true } );


    return gulp.src( config.source.getFiles('css') )

        .pipe( gulpIf( config.sourcemaps, sourcemaps.init() ) )
        // sass
        .pipe( sass( options.sass ) )
        // start optimizing...
        .pipe( gulpIf( options.minify, sizeBefore ) )
        .pipe( gulpIf( options.removeUnused, uncss( options.uncss ) ) )
        .pipe( gulpIf( options.minify, gulpMinCss( options.cleanCSS ) ) )

        .pipe( autoprefixer( options.autoprefixer ) )

        // sourcemaps need a relative path from the output folder
        .pipe( gulpIf( config.sourcemaps, sourcemaps.write( path.relative( config.dest.getPath( 'css' ), config.dest.getPath( 'sourcemaps' ) ) ) ) )

        .pipe( gulp.dest( config.dest.getPath('css') ) )
        // exclude map files because somehow they break the browserSync flow/connection
        .pipe( gulpIgnore.exclude( '*.map' ) )

        //.pipe( gulpBless() ) TODO: split css for IE9
        .pipe( gulp.dest( config.dest.getPath('css') ) )

        .pipe( gulpIf( options.minify, sizeAfter ) )
        .on( 'end', log.size( {
            sender: 'sass',
            message: 'css - ',
            size: sizeBefore,
            sizeAfter: sizeAfter,
            wrap: true,
            check: options.minify
        } ) )
        .pipe( browserSync.reload( { stream: true } ) );

} );



