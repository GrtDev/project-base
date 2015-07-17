// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var config                  = require('../config');
var log                     = require('../util/log');

var path                    = require('path');
var gulp                    = requireCachedModule('gulp');
var handlebars              = requireCachedModule('gulp-hb');
var rename                  = requireCachedModule('gulp-rename');
var htmlmin                 = requireCachedModule('gulp-htmlmin');
var gulpif                  = requireCachedModule('gulp-if');
var frontMatter             = requireCachedModule('gulp-front-matter');
var browserSync             = requireCachedModule('browser-sync');
var glob                    = requireCachedModule('glob');
var prettify                = requireCachedModule('gulp-jsbeautifier');

//@formatter:on
/**
 *  Gulp task responsible for compiling the handlebar templates to html.
 *  @see: http://handlebarsjs.com/
 *  @see: https://www.npmjs.com/package/gulp-hb
 */
gulp.task( 'handlebars', function () {

    var options = {

        source: [
            config.source.getPath( 'markup', '!(' + config.ignorePrefix + ')*.hbs' ),
            config.source.getPath( 'markup', '!(' + config.ignorePrefix + ')/**/!(' + config.ignorePrefix + ')*.hbs' )
        ],
        dest: config.dest.getPath( 'markup' ),

        handlebars: {
            // Data that is added to the context when rendering the templates
            data: config.source.getPath( 'markup', '_data/**/*.json' ),
            helpers: config.source.getPath( 'markup', '_helpers/**/*.js' ),     // Helpers that are made available in the templates
            partials: config.source.getPath( 'markup', '_partials/**/*.hbs' ),   // Partials that are made available in the templates

            bustCache: true,       // default false
            debug: false,          // Whether to log the helper names, partial names, and root property names for each file as they are rendered.

            // By default, globbed data files are merged into a object structure according to
            // the shortest unique file path without the extension, where path separators determine object nesting.
            parseDataName: parseDataName,
            // A pre-render hook to modify the context object being passed to the handlebars template on a per-file basis.
            // May be used to load additional file-specific data.
            dataEach: onDataEach
        },

        frontmatter: {
            // defines the property that is added to the file object
            // Note: Can NOT be any of the following: 'history','cwd','base','stat','_contents','isBuffer','isStream','isNull','isDirectory','clone','pipe','inspect'.
            property: 'front',
            remove: true // should we remove front-matter header?
        },

        // @see: https://www.npmjs.com/package/gulp-jsbeautifier
        pretty: config.prettyHTML,
        prettyConfig: {
            html: {
                unformatted: [ "sub", "sup", "b", "i", "u", "svg", "pre" ],
                wrapAttributes: 'auto'
            }
        },

        minify: config.minifyHTML,
        htmlmin: {
            collapseWhitespace: true,
            removeComments: true,
            minifyJS: true,
            minifyCSS: true,
            keepClosingSlash: true // can break SVG if not set to true!
        }
    }

    // @formatter:on


    // Check if we are not doing unnecessary tasks.
    if( options.pretty && options.minify ) log.warn( {
        sender: 'handlebars',
        message: 'You should not use both prettifyHTML and minifyHTML at the same time in your config...'
    } );


    /**
     * Defines under what object the data from the loaded json files can be found.
     * this.handlebars <- current handlebars instance
     * file.path       <- full system path with extension
     * file.shortPath  <- shortest unique path without extension
     * file.exports    <- result of requiring the helper
     * @param file
     * @returns {string}
     */
    function parseDataName ( file ) {

        // Ignore directory names
        return path.basename( file.path, '.json' );

    };

    /**
     * A pre-render hook to modify the context object being passed to the handlebars template on a per-file basis.
     * May be used to load additional file-specific data.
     * NOTE: Make sure to pass this function in the options.handlebars config.
     * @param context {object}
     * @param file {Vinyl}
     * @returns {object}
     */
    function onDataEach ( context, file ) {

        var fileName = path.basename( file.path, '.hbs' );
        var metaDataFilePath = config.source.getPath( 'markup', '_data/pages/' + fileName + '.json' );

        // pass some basic options to the files
        context.options = {

            debug: config.debug

        }

        // Add meta data to the pages that is available in the _data/pages folder
        try {

            // throws an error if the file does not exist
            context.meta = require( path.relative( __dirname, metaDataFilePath ) );

        } catch ( error ) {

            if( config.verbose ) console.log( 'No meta data file found for page: ' + fileName );

        }


        switch ( fileName ) {
            case 'styleguide':
                // nothing special
                break;
            case 'index':

                // get list of pages. then convert the list into a tree & strip project path
                var pagesList = getPagesList( options );
                if( pagesList ) {

                    var pageTree = createFileTree( pagesList, '_files', 'html' );
                    context.pages = pageTree;

                } else {

                    log.error( { message: 'Failed to generate the list of pages', plugin: 'handlebars' } )

                }

            // no break!

            default:

                // strip svg data since we don't need it anywhere else but in the styleguide
                if( context[ 'svg-filelist' ] ) context[ 'svg-filelist' ] = undefined;

                break;
        }

        return context;
    }

    return gulp.src( options.source )

        .pipe( frontMatter( options.frontmatter ) )
        .pipe( handlebars( options.handlebars ) )

        .pipe( gulpif( options.pretty, prettify( options.prettyConfig ) ) )
        .pipe( gulpif( options.minify, htmlmin( options.htmlmin ) ) )
        .pipe( rename( function ( path ) {
            path.extname = '.html';
        } ) )
        .pipe( gulp.dest( options.dest ) )
        .pipe( browserSync.reload( { stream: true } ) );

} );

/**
 * Retrieves a list of page paths
 * @param options {object} the configuration object for the handlebars task
 */
function getPagesList ( options ) {

    var pagesList = [];

    if( typeof options.source === 'string' ) {

        pagesList = glob.sync( options.source );

    } else if( Array.isArray( options.source ) ) {

        for ( var i = 0, leni = options.source.length; i < leni; i++ ) {

            var source = options.source[ i ];
            var list = glob.sync( source );
            pagesList = pagesList.concat( list );

        }

    }

    return pagesList;
}

/**
 * Converts an array with file urls into a object tree.
 * @param filePaths {Array}
 * @param treeFileProperty {string} defines on what property the array with files are written to.
 * @param opt_fileExtention {string} replace file extention.
 */
function createFileTree ( filePaths, treeFileProperty, opt_fileExtention ) {

    var fileTree = {};
    var extensionRegExp = /\.\w*$/;
    var markupSourceRoot = config.source.getPath( 'markup' );

    for ( var i = 0, leni = filePaths.length; i < leni; i++ ) {

        var pagePath = filePaths[ i ];
        pagePath = path.relative( markupSourceRoot, pagePath );
        if( opt_fileExtention )pagePath = pagePath.replace( extensionRegExp, '.' + opt_fileExtention );
        pagePath = pagePath.split( path.sep );

        var currentPathNode = fileTree;
        for ( var j = 0, lenj = pagePath.length; j < lenj; j++ ) {

            var pathNode = pagePath[ j ];

            if( j < (lenj - 1) ) {

                if( typeof currentPathNode[ pathNode ] === 'undefined' )  currentPathNode[ pathNode ] = {};
                currentPathNode = currentPathNode[ pathNode ];

            } else {

                if( typeof currentPathNode[ treeFileProperty ] === 'undefined' )  currentPathNode[ treeFileProperty ] = [];
                // the last node is the filename
                currentPathNode[ treeFileProperty ].push( pathNode );

            }

        }

    }

    return fileTree;

}



