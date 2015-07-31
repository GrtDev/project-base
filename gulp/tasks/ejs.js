// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var config                  = require('../config');
var log                     = require('../util/log');
var mergeJSONData           = require('../util/mergeJSONData');
var packageJSON             = require(process.cwd() + '/package.json');

var fileSystem              = require( 'fs' );
var path                    = require('path');
var gulp                    = requireCachedModule('gulp');
var ejs                     = requireCachedModule('gulp-ejs');
var htmlmin                 = requireCachedModule('gulp-htmlmin');
var gulpif                  = requireCachedModule('gulp-if');
var browserSync             = requireCachedModule('browser-sync');
var prettify                = requireCachedModule('gulp-jsbeautifier');

var debugHelper             = require('../ejs/helpers/debug');
var svgHelper               = require('../ejs/helpers/svg');

//@formatter:on

/**
 *  Gulp task responsible for compiling the handlebar templates to html.
 *  @see: https://github.com/tj/ejs
 *  @see: https://www.npmjs.com/package/ejs
 *  @see: https://www.npmjs.com/package/gulp-ejs
 */
gulp.task( 'ejs', function () {

    var options = {

        source: config.source.getPath( 'markup', '!(' + config.ignorePrefix + ')*.ejs' ),
        dest: config.dest.getPath( 'markup' )

    };

    options.ejs = {

        // data that will be loaded and added to the context. Root path is needed to define under what property name the data will be available in.
        contextData: {
            source: config.source.getPath( 'markupData', '**/*.json' ),
            root: config.source.getPath( 'markupData' )
        },

        // A hash object where each key corresponds to a variable in your template. Also you can set ejs options in this hash.
        // because the options are mixed into this has the following keys are reserved for the settings.
        // cache, filename, context, compileDebug, client, delimiter, debug, _with, rmWhitespace
        context: {

            // EJS settings
            cache: false,           // Compiled functions are cached, requires filename
            filename: undefined,    // prefilled in the gulp-ejs task
            context: undefined,     // Function execution context
            compileDebug: false,    // When false no debug instrumentation is compiled
            client: undefined,      // Returns standalone compiled function
            delimiter: '%',         // Character to use with angle brackets for open/close
            debug: false,           // Output generated function body
            _with: true,            // Whether or not to use with() {} constructs. If false then the locals will be stored in the locals object.
            rmWhitespace: false,    // Remove all safe-to-remove whitespace, including leading and trailing whitespace. It also enables a safer
                                    // version of -%> line slurping for all scriptlet tags (it does not strip new lines of tags in the middle of a line).

            // Data for the templates
            title: 'default title',
            svg: svgHelper,
            data: debugHelper,
            test: 'TEST',
            process: 'PROCESS'
        },

        settings: {
            ext: '.html'
        }

    };

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
        sender: 'EJS',
        message: 'You should not use both prettifyHTML and minifyHTML at the same time in your config...'
    } );

    // Assign a context property to itself so we can log the data if needed.

    var markupData = {};// mergeJSONData( options.ejs.contextData.root, options.ejs.contextData.source );

    // merge data into the context object
    for ( var key in markupData ) {

        if( options.ejs.context[ key ] !== undefined ) log.warn( {
            sender: 'EJS',
            message: 'Duplicate context key used! Will be overwritten! key: ' + key
        } );

        options.ejs.context[ key ] = markupData[ key ];

    }

    options.ejs.context.context = options.ejs.context;


    return gulp.src( options.source )

        .pipe( ejs(options.ejs.context, options.ejs.settings) )

        .pipe( gulpif( options.pretty, prettify( options.prettyConfig ) ) )
        .pipe( gulpif( options.minify, htmlmin( options.htmlmin ) ) )

        .pipe( gulp.dest( options.dest ) );

        // Browser Sync is reloaded from the watch task for HTML files to bypass a chrome bug.
        // See the watch task for more info.

} );