// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var config                  = require('../config');
var log                     = require('../util/log');
var packageJSON             = require(process.cwd() + '/package.json');

var path                    = require('path');
var gulp                    = requireCachedModule('gulp');
var fileInclude             = requireCachedModule('gulp-file-include');
var htmlmin                 = requireCachedModule('gulp-htmlmin');
var gulpif                  = requireCachedModule('gulp-if');
var browserSync             = requireCachedModule('browser-sync');
var prettify                = requireCachedModule('gulp-jsbeautifier');

//@formatter:on


/**
 *  Gulp task responsible for compiling the handlebar templates to html.
 *  @see: http://handlebarsjs.com/
 *  @see: https://www.npmjs.com/package/gulp-hb
 */
gulp.task( 'fileInclude', function () {
    

    var options = {

        source: config.source.getPath( 'markup', '!(' + config.ignorePrefix + ')*.html' ),
        dest: config.dest.getPath( 'markup' )

    }

    // @formatter:off
    options.fileInclude = {

        prefix: '@@',                   // default: '@@'
        suffix: '',                     // default: ''
        basepath: '@file',              // default: @file, it could be @root, @file, your-basepath
        filters: undefined,             // filters of include content
        context: {                       // global context
            version:packageJSON.version
        },
        indent: false                   // default: false

    };
    // @formatter:on

    options.minify  = config.minifyHTML;
    options.htmlmin = {

        collapseWhitespace: true,
        removeComments:     true,
        minifyJS:           true,
        minifyCSS:          true,
        keepClosingSlash:   true // can break SVG if not set to true!

    };

    // @see: https://www.npmjs.com/package/gulp-jsbeautifier
    options.pretty = config.prettyHTML;
    options.prettyConfig = {

        html: {
            unformatted: [ "sub", "sup", "b", "i", "u", "svg", "pre" ],
            wrapAttributes: 'auto'
        }

    };

    // Check if we are not doing unnecessary tasks.
    if( options.pretty && options.minify ) log.warn( {
        sender: 'file include',
        message: 'You should not use both prettifyHTML and minifyHTML at the same time in your config...'
    } );




    return gulp.src( options.source )

        .pipe( fileInclude( options.fileInclude ) )

        .pipe( gulpif( options.pretty, prettify( options.prettyConfig ) ) )
        .pipe( gulpif( options.minify, htmlmin( options.htmlmin ) ) )

        .pipe( gulp.dest( options.dest ) );

        // Browser Sync is reloaded from the watch task for HTML files to bypass a chrome bug.
        // See the watch task for more info.

} );




