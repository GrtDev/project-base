// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var config                  = require('../config');
var log                     = require('../util/log');
var createHTMLFileList      = require('../util/createHTMLFileList');


var fileSystem              = require('fs');
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
var mkdirp                  = requireCachedModule('mkdirp');


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
        dest: config.dest.getPath( 'markup' )

    };

    options.htmlPageListPartial = {

        dest: config.source.getPath( 'markupPartials', 'debug'),
        fileName: '_pagesList.hbs'

    };

    options.handlebars = {

        data:       config.source.getPath( 'markupData',      '**/*.json' ), // Data that is added to the context when rendering the templates
        helpers:    config.source.getPath( 'markupHelpers',   '**/*.js' ),   // Helpers that are made available in the templates
        partials:   config.source.getPath( 'markupPartials',  '**/*.hbs' ),  // Partials that are made available in the templates

        bustCache: true,       // default false
        debug: false,          // Whether to log the helper names, partial names, and root property names for each file as they are rendered.

        // By default, globbed data files are merged into a object structure according to
        // the shortest unique file path without the extension, where path separators determine object nesting.
        parseDataName: parseDataName,

        // A pre-render hook to modify the context object being passed to the handlebars template on a per-file basis.
        // May be used to load additional file-specific data.
        dataEach: onDataEach
    };


    options.frontmatter = {
        // defines the property that is added to the file object
        // Note: Can NOT be any of the following: 'history','cwd','base','stat','_contents','isBuffer','isStream','isNull','isDirectory','clone','pipe','inspect'.
        property: 'front',
        remove: true // should we remove front-matter header?
    };

    // @see: https://www.npmjs.com/package/gulp-jsbeautifier
    options.pretty = config.prettyHTML;
    options.prettyConfig = {
        html: {
            unformatted: [ "sub", "sup", "b", "i", "u", "svg", "pre" ],
            wrapAttributes: 'auto'
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

        // TODO: Fix for pages inside folders
        var fileName = path.basename( file.path, '.hbs' );
        var metaDataFilePath = config.source.getPath( 'markupData', 'pages/' + fileName + '.json' );

        // add some config data to the context
        context.config = {

            name: config.name,
            debug: config.debug,
            version: config.version

        }

        // Add meta data to the pages that is available in the _data/pages folder
        try {

            // throws an error if the file does not exist
            context.meta = require( path.relative( __dirname, metaDataFilePath ) );

        } catch ( error ) {

            if( config.verbose ) log.debug( {
                sender: 'handlebars',
                message: 'No meta data file found for page: ' + fileName
            } );

        }

        return context;
    }


    // Creates a HTML list of all the pages
    var htmlFileTreeListPartial = createHTMLFileList( options.source, config.source.getPath( 'markup' ) );

    try {

        // Make sure the directory exists
        mkdirp.sync( options.htmlPageListPartial.dest );
        fileSystem.writeFileSync( options.htmlPageListPartial.dest + path.sep + options.htmlPageListPartial.fileName, htmlFileTreeListPartial );

    } catch ( error ) {

        log.error( error );

    }


    return gulp.src( options.source )

        .pipe( frontMatter( options.frontmatter ) )
        .pipe( handlebars( options.handlebars ) )

        .pipe( gulpif( options.pretty, prettify( options.prettyConfig ) ) )
        .pipe( gulpif( options.minify, htmlmin( options.htmlmin ) ) )
        .pipe( rename( function ( path ) {
            path.extname = '.html';
        } ) )
        .pipe( gulp.dest( options.dest ) );

    // Browser Sync is reloaded from the watch task for HTML files to bypass a chrome bug.
    // See the watch task for more info.

} );


