// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var config                  = require('../config');
var log                     = require('../util/log');
var mergeJSONData           = require('../util/mergeJSONData');
var fileUtils               = require('../util/fileUtils');
var packageJSON             = require('../../package.json');
var SvgExtension            = require('../template/nunjucks/SvgExtension');
var DebugExtension          = require('../template/nunjucks/DebugExtension');

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


var RESERVED_DATA_KEYWORDS  = [ 'project', 'ext' ];


//@formatter:on

/**
 *  Gulp task responsible for compiling the templates into normal HTML using Mozilla nunjucks templates
 *  @see: http://mozilla.github.io/nunjucks/api.html
 *  @see: https://www.npmjs.com/package/gulp-nunjucks-render
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

        // useful for Angular projects
        //tags: {
        //    blockStart: '<%',
        //    blockEnd: '%>',
        //    variableStart: '<$',
        //    variableEnd: '$>',
        //    commentStart: '<#',
        //    commentEnd: '#>'
        //},

        watch: false



    }


    var contextData = {};
    var jsonData = mergeJSONData( config.source.getPath( 'data' ), config.source.getFiles( 'data' ) );

    // merge retrieved data into the context object
    for ( var key in jsonData ) {

        if( RESERVED_DATA_KEYWORDS.indexOf( key ) >= 0 ) {

            log.error( {
                sender: 'html',
                message: 'A data object has been given a reserved keyword as a name, please update the file name : ' + key + '.\nReserved keywords: ' + RESERVED_DATA_KEYWORDS
            } );

        } else {

            contextData[ key ] = jsonData[ key ];

        }

    }

    var pagesList = fileUtils.getList( config.source.getFiles( 'html' ), config.source.getPath( 'html' ) );
    var svgList = fileUtils.getList( config.source.getFiles( 'svg' ), config.source.getPath( 'svg' ), true );

    contextData.project = {
        name: packageJSON.name,
        description: packageJSON.description,
        author: packageJSON.author,
        version: packageJSON.version,
        debug: config.debug,
        pages: pagesList,
        svgs: svgList
    }


    function getDataForFile ( file ) {

        return contextData;

    }


    var environment = gulpNunjucks.nunjucks.configure( [ config.source.getPath( 'html' ) ], options.nunjuck );

    environment.addExtension( 'SVGExtension', new SvgExtension() );
    environment.addExtension( 'DebugExtension', new DebugExtension() );


    return gulp.src( config.source.getFiles( 'html' ), { base: config.source.getPath( 'html' ) } )

        .pipe( gulpData( getDataForFile ) )
        .pipe( gulpNunjucks() )

        .pipe( gulpif( options.pretty, prettify( options.prettyConfig ) ) )
        .pipe( gulpif( options.minify, htmlmin( options.htmlmin ) ) )

        .pipe( gulp.dest( config.dest.getPath( 'html' ) ) );

    // Browser Sync is reloaded from the watch task for HTML files to bypass a chrome bug.
    // See the watch task for more info.

} );
