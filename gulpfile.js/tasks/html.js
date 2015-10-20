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
var gulpData                = requireCachedModule('gulp-data');
var gulpNunjucks            = requireCachedModule('gulp-nunjucks-render');
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
gulp.task( 'html', function () {

    var options = {

        //htmlPageListPartial: {
        //    dest: config.source.getPath( 'markupPartials', 'debug' ),
        //    fileName: 'pagesList.swig'
        //}

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


    var markupData = mergeJSONData( config.source.getPath( 'data' ), config.source.getFiles( 'data' ) );

    // merge retrieved data into the context object
    for ( var key in markupData ) {

        if( RESERVED_KEYWORDS.indexOf( key ) >= 0 ) {
            log.error( {
                sender: 'swig',
                message: 'A data object has been given a reserved keyword as a name, please update the file name : ' + key + '.\nReserved keywords: ' + RESERVED_KEYWORDS
            } );
            continue;
        }

        //if( options.swig.data[ key ] !== undefined ) log.warn( {
        //    sender: 'swig',
        //    message: 'Duplicate context key used! Will be overwritten! key: ' + key
        //} );

    }



    //// Creates a HTML list of all the pages
    //var htmlFileTreeListPartial = htmlFileList.create( config.source.getFiles( 'markup' ), config.source.getPath( 'markup' ) );
    //
    //try {
    //
    //    // Make sure the directory exists
    //    mkdirp.sync( options.htmlPageListPartial.dest );
    //    fileSystem.writeFileSync( options.htmlPageListPartial.dest + path.sep + options.htmlPageListPartial.fileName, htmlFileTreeListPartial );
    //
    //} catch ( error ) {
    //
    //    log.error( error, true );
    //
    //}



    function getDataForFile(file){

        return markupData;

    }


    gulpNunjucks.nunjucks.configure( [ config.source.getPath('html') ], { watch: false } );


    return gulp.src( config.source.getFiles('html') )

        .pipe( gulpData( getDataForFile ) )
        .pipe( gulpNunjucks() )

        .pipe( gulpif( options.pretty, prettify( options.prettyConfig ) ) )
        .pipe( gulpif( options.minify, htmlmin( options.htmlmin ) ) )

        .pipe( gulp.dest( config.dest.getPath('html') ) );

    // Browser Sync is reloaded from the watch task for HTML files to bypass a chrome bug.
    // See the watch task for more info.

} );
