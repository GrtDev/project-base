// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var config                  = require('../config');
var log                     = require('../util/log');
var mergeJSONData           = require('../util/mergeJSONData');
var fileUtils               = require('../util/fileUtils');
var packageJSON             = require('../../package.json');
var htmlFileList            = require('../template/partials/htmlFileList');
var SvgExtension            = require('../template/nunjucks/SvgExtension');
var DebugExtension          = require('../template/nunjucks/DebugExtension');

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
var glob                    = requireCachedModule('glob');

var swigSVGTag              = require('../template/swig/tags/svg');
var swigDebugTag            = require('../template/swig/tags/debug');
var swigDebugFilter         = require('../template/swig/filters/debug');

// If you change these names, make sure they aren't already in the reserved words list, AND update the name also in the createSVGFileList.js
var dataHelperName          = 'debug';
var svgHelperName           = 'svg';
var RESERVED_KEYWORDS       = [ dataHelperName, svgHelperName, 'project' ];




//@formatter:on

/**
 *  Gulp task responsible for compiling the swig templates into normal HTML
 *  @see: http://paularmstrong.github.io/swig/
 *  @see: https://www.npmjs.com/package/gulp-swig
 */
gulp.task( 'html', function () {

    var options = {};

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



    options.nunjuck = {

        watch: false

    }


    var data = mergeJSONData( config.source.getPath( 'data' ), config.source.getFiles( 'data' ) );

    // merge retrieved data into the context object
    for ( var key in data ) {

        if( RESERVED_KEYWORDS.indexOf( key ) >= 0 ) {
            log.error( {
                sender: 'html',
                message: 'A data object has been given a reserved keyword as a name, please update the file name : ' + key + '.\nReserved keywords: ' + RESERVED_KEYWORDS
            } );
        }

    }

    var pagesList = fileUtils.getList( config.source.getFiles( 'html' ), config.source.getPath( 'html' ) );
    var svgList = fileUtils.getList( config.source.getFiles( 'svg' ), config.source.getPath( 'svg' ), true );

    data.project = {
        name: packageJSON.name,
        description: packageJSON.description,
        author: packageJSON.author,
        version: packageJSON.version,
        debug: config.debug,
        pages: pagesList,
        svgs: svgList
    }



    function getDataForFile ( file ) {

        return data;

    }



    var environment = gulpNunjucks.nunjucks.configure( [ config.source.getPath( 'html' ) ], options.nunjuck );

    environment.addExtension( 'SVGExtension', new SvgExtension() );
    environment.addExtension( 'DebugExtension', new DebugExtension() );



    return gulp.src( config.source.getFiles( 'html' ) )

        .pipe( gulpData( getDataForFile ) )
        .pipe( gulpNunjucks() )

        .pipe( gulpif( options.pretty, prettify( options.prettyConfig ) ) )
        .pipe( gulpif( options.minify, htmlmin( options.htmlmin ) ) )

        .pipe( gulp.dest( config.dest.getPath( 'html' ) ) );

    // Browser Sync is reloaded from the watch task for HTML files to bypass a chrome bug.
    // See the watch task for more info.

} );
