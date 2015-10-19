// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var config                  = require('../config');
var log                     = require('../util/log');
var mergeJSONData           = require('../util/mergeJSONData');
var packageJSON             = require('../../package.json');
var htmlFileList            = require('../template/partials/htmlFileList');

var fileSystem              = require( 'fs' );
var path                    = require('path');
var mkdirp                  = requireCachedModule('mkdirp');
var gulp                    = requireCachedModule('gulp');
var swig                    = requireCachedModule('gulp-swig');
var htmlmin                 = requireCachedModule('gulp-htmlmin');
var gulpif                  = requireCachedModule('gulp-if');
var browserSync             = requireCachedModule('browser-sync');
var prettify                = requireCachedModule('gulp-jsbeautifier');

var swigSVGTag              = require('../template/swig/tags/svg');
var swigDebugTag            = require('../template/swig/tags/debug');
var swigDebugFilter         = require('../template/swig/filters/debug');

// If you change these names, make sure they aren't already in the reserved words list, AND update the name also in the createSVGFileList.js
var dataHelperName          = 'debug';
var svgHelperName           = 'svg';
var RESERVED_KEYWORDS       = [dataHelperName, svgHelperName];




//@formatter:on

/**
 *  Gulp task responsible for compiling the swig templates into normal HTML
 *  @see: http://paularmstrong.github.io/swig/
 *  @see: https://www.npmjs.com/package/gulp-swig
 */
gulp.task( 'swig', function () {

    var options = {

        htmlPageListPartial: {
            dest: config.source.getPath( 'markupPartials', 'debug' ),
            fileName: 'pagesList.swig'
        }

    };

    // data that will be loaded and added to the context. Root path is needed to define under what property name the data will be available in.
    options.jsonData = {

        // TODO: Fix this with the normal data filder

        source: config.source.getPath( 'data', '!(pages)**.json' ),
        root: config.source.getPath( 'data' )

    };


    options.swig = {

        setup: setupSwig,
        ext: '.html',
        load_json: true,
        json_path: config.source.getPath( 'data', 'pages/'),

        defaults: {

            // @see: http://paularmstrong.github.io/swig/docs/api/#SwigOpts
            locals: {},                 // Default variable context to be passed to all templates.
            autoescape: true,
            cache: false,
            varControls: [ '{{', '}}' ],  // Open and close controls for variables. Defaults to ['{{', '}}'].
            tagControls: [ '{%', '%}' ],  // Open and close controls for tags. Defaults to ['{%', '%}'].
            cmtControls: [ '{#', '#}' ]   // Open and close controls for comments. Defaults to ['{#', '#}'].

        },

        // A hash object where each key corresponds to a variable in your template. Also you can set ejs options in this hash.
        // because the options are mixed into this has the following keys are reserved for the settings.
        // cache, filename, context, compileDebug, client, delimiter, debug, _with, rmWhitespace
        data: {

            // Data for the templates
            project: {
                name: packageJSON.name,
                description: packageJSON.description,
                author: packageJSON.author,
                version: packageJSON.version,
                debug: config.debug
            }

        }

    };


    options.minify = config.minifyHTML;


    // @formatter:off
    options.htmlmin = {

        collapseWhitespace: true,
        removeComments:     true,
        minifyJS:           true,
        minifyCSS:          true,
        keepClosingSlash:   true // can break SVG if not set to true!

    };
    // @formatter:on

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
        sender: 'swig',
        message: 'You should not use both prettifyHTML and minifyHTML at the same time in your config...'
    } );


    var markupData = mergeJSONData( options.jsonData.root, options.jsonData.source );

    // merge retrieved data into the context object
    for ( var key in markupData ) {

        if( RESERVED_KEYWORDS.indexOf( key ) >= 0 ) {
            log.error( {
                sender: 'swig',
                message: 'A data object has been given a reserved keyword as a name, please update the file name : ' + key + '.\nReserved keywords: ' + RESERVED_KEYWORDS
            } );
            continue;
        }

        if( options.swig.data[ key ] !== undefined ) log.warn( {
            sender: 'swig',
            message: 'Duplicate context key used! Will be overwritten! key: ' + key
        } );

        options.swig.data[ key ] = markupData[ key ];

    }


    function setupSwig ( swig ) {

        swig.setDefaults( { loader: swig.loaders.fs( config.source.getPath( 'markupPartials' ) ) } );

        swig.setFilter('debug', swigDebugFilter);

        swig.setTag( 'svg', swigSVGTag.parse, swigSVGTag.compile, swigSVGTag.ends, swigSVGTag.blockLevel );
        swig.setTag( 'debug', swigDebugTag.parse, swigDebugTag.compile, swigDebugTag.ends, swigDebugTag.blockLevel );

    }


    // Creates a HTML list of all the pages
    var htmlFileTreeListPartial = htmlFileList.create( config.source.getFiles( 'markup' ), config.source.getPath( 'markup' ) );

    try {

        // Make sure the directory exists
        mkdirp.sync( options.htmlPageListPartial.dest );
        fileSystem.writeFileSync( options.htmlPageListPartial.dest + path.sep + options.htmlPageListPartial.fileName, htmlFileTreeListPartial );

    } catch ( error ) {

        log.error( error, true );

    }


    return gulp.src( config.source.getFiles('markup') )

        .pipe( swig( options.swig ) )

        .pipe( gulpif( options.pretty, prettify( options.prettyConfig ) ) )
        .pipe( gulpif( options.minify, htmlmin( options.htmlmin ) ) )

        .pipe( gulp.dest( config.dest.getPath('markup') ) );

    // Browser Sync is reloaded from the watch task for HTML files to bypass a chrome bug.
    // See the watch task for more info.

} );
