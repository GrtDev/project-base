// @formatter:off

var config                  = require('../config');
var log                     = require('../util/log');
var requireCachedModule     = require('../util/requireCachedModule');
var path                    = require('path');

var gulp                    = requireCachedModule('gulp');
var uglify                  = requireCachedModule('gulp-uglify');
var gulpSize                = requireCachedModule('gulp-size');
var sourcemaps              = requireCachedModule('gulp-sourcemaps');
var gulpDebug               = requireCachedModule('gulp-debug');
var gulpPlumber             = requireCachedModule('gulp-plumber');
var gulpIf                  = requireCachedModule('gulp-if');
var gulpIgnore              = requireCachedModule('gulp-ignore');
var browserSync             = requireCachedModule('browser-sync');
var watchify                = requireCachedModule('watchify');
var browserify              = requireCachedModule('browserify');
var source                  = requireCachedModule('vinyl-source-stream');
var mergeStream             = requireCachedModule('merge-stream');
var buffer                  = requireCachedModule('vinyl-buffer');
var glob                    = requireCachedModule('glob');


//@formatter:on

/**
 *  Creates a set of bundle configurations to be run with the browserify task.
 *  Add your own configuration to the output Array.
 * @returns [ {object} ] Array with bundle configuration objects
 */
function createBundleConfigs () {

    // Set your default options here
    var options = {

        sourcemaps: config.sourcemaps,
        sourcemapsDest: config.dest.getPath('sourcemaps'),

        minify: config.minify,
        uglifyOptions: {
            mangle: true, // Pass false to skip mangling names.
            preserveComments: false // 'all', 'some', {function}
        },

        plumberConfig: {
            errorHandler: log.error
        },

        debugConfig: {
            title: 'browserify-debug:',
            minimal: true // By default only relative paths are shown. Turn off minimal mode to also show cwd, base, path.
        }

    }

    // convert to a relative path used by sourcemaps
    //options.sourcemapsDest = path.relative(options.dest, options.sourcemapsDest);

    options.browserifyOptions = {
        debug: options.sourcemaps // enables sourcemap creation of browserify itself
    };

    var bundleConfigs = [];
    var fileEntries = [];
    var fileGlob = config.source.getFiles('javascript');


    if( Array.isArray( fileGlob ) ) {

        for ( var i = 0, leni = fileGlob.length; i < leni; i++ ) {

            var files = glob.sync( fileGlob[ i ] );
            fileEntries = fileEntries.concat( files );

        }

    } else {

        fileEntries = glob.sync( fileGlob );

    }


    for ( var i = 0, leni = fileEntries.length; i < leni; i++ ) {

        var entry = fileEntries[ i ];
        var name = path.basename( entry );
        var bundleConfig = createBundleConfig( name, entry, options )

        bundleConfigs.push( bundleConfig );

    }

    return bundleConfigs;
}


/**
 * Creates a bundle config for the given file.
 * @param fileName {string}
 * @param filePath {string}
 * @param options {object} bundle settings
 * @returns {{}} bundleConfig
 */
function createBundleConfig ( fileName, filePath, options ) {

    if( !fileName ) return log.error( { message: 'fileName can not be null!', sender: 'browserify task' } );
    if( !filePath ) return log.error( { message: 'filePath can not be null!', sender: 'browserify task' } );
    if( !options ) return log.error( { message: 'options can not be null!', sender: 'browserify task' } );

    var bundleConfig = {}

    // duplicate the object
    for(var key in options)	bundleConfig[key] = options[key];

    bundleConfig.fileName = fileName;
    bundleConfig.source = filePath;

    // define the destination base on the entry file
    bundleConfig.dest = filePath;
    bundleConfig.dest = bundleConfig.dest.replace(config.source.getPath('javascript'), '');
    bundleConfig.dest = bundleConfig.dest.replace(fileName, '');
    bundleConfig.dest = config.dest.getPath('javascript', bundleConfig.dest);

    return bundleConfig;
}

/**
 * Creates a bundle for the given configuration.
 * @param bundleConfig {object} configuration for the bundle.
 * @param opt_watch {=boolean} whether wacify is used.
 * @returns {stream}
 */
function createBundle ( bundleConfig, opt_watch ) {

    if( opt_watch ) {
        // A watchify require/external bug that prevents proper recompiling,
        // so (for now) we'll ignore these options during development. Running
        // `gulp browserify` directly will properly require and externalize.
        // @see: https://github.com/greypants/gulp-starter/blob/master/gulp/tasks/browserify.js

        delete bundleConfig.browserifyOptions[ 'require' ];
        delete bundleConfig.browserifyOptions[ 'external' ];
    }

    var browserifyInstance = browserify( bundleConfig.source, bundleConfig.browserifyOptions );

    if( opt_watch ) {
        // Wrap with watchify and rebundle on changes
        browserifyInstance = watchify( browserifyInstance );
        // Rebundle on update
        browserifyInstance.on( 'update', bundle );
        // log that we are watching this bundle
        log.info( { sender: 'browserify', message: 'watching files for bundle: ' + bundleConfig.fileName } );

    } else {
        // Sort out shared dependencies.
        // browserifyInstance.require exposes modules externally
        if( bundleConfig.require ) browserifyInstance.require( bundleConfig.require );
        // browserifyInstance.external excludes modules from the bundle, and expects
        // they'll be available externally
        if( bundleConfig.external ) browserifyInstance.external( bundleConfig.external );

    }

    /**
     * Creates a bundle of the current config.
     * @returns {stream}
     */
    function bundle () {

        // Keep track of the file size changes
        // @see: https://github.com/sindresorhus/gulp-size
        var sizeBefore = gulpSize( { showFiles: true } );
        var sizeAfter = gulpSize( { showFiles: true } );

        return browserifyInstance.bundle()
            .on( 'error', log.error )
            // log the start and keep track of the task process time.
            .on( 'readable', log.info( {
                sender: 'browserify',
                message: 'bundling:\t' + log.colors.cyan(bundleConfig.fileName),
                wrap: true
            } ) )
            // Use vinyl-source-stream to make the stream gulp compatible.
            // Specify the desired output filename here.
            .pipe( source( bundleConfig.fileName ) )
            .on( 'error', log.error )
            // Add plumber to keep the pipe going and to catch errors
            .pipe( gulpPlumber( bundleConfig.plumberConfig ) )
            // print file names if in gulp debug mode
            .pipe( gulpIf( config.gulp.debug, gulpDebug( bundleConfig.debugConfig ) ) )

            // convert from streaming to buffer object for uglify
            .pipe( buffer() )
            .pipe( gulpIf( config.sourcemaps, sourcemaps.init( { loadMaps: true } ) ) )

            .pipe(gulpIf(bundleConfig.minify,   sizeBefore))

            .on( 'end', log.info( {
                sender: 'browserify',
                message: 'minifying:\t' + log.colors.cyan(bundleConfig.fileName),
                wrap: true,
                check: bundleConfig.minify
            } ) )

            .pipe( gulpIf( bundleConfig.minify, uglify( bundleConfig.uglifyOptions ) ) )

            // sourcemaps need a relative path from the output folder
            .pipe( gulpIf( config.sourcemaps, sourcemaps.write( path.relative( bundleConfig.dest, config.dest.getPath( 'sourcemaps' ) ) ) ) )

            .pipe( gulp.dest( bundleConfig.dest ) )


            // log the end of the bundle task and calculate the task time.
            .on( 'end', log.info( {
                sender: 'browserify',
                message: 'finished:\t' + log.colors.cyan(bundleConfig.fileName),
                wrap: true
            } ) )

            // remove the maps from the stream because it can cause problems with browserSync
            .pipe( gulpIgnore.exclude( '*.map' ) )
            .pipe(gulpIf(bundleConfig.minify, sizeAfter))
            .on('end', log.size({sender: 'browserify', message: bundleConfig.fileName + ' - ', size:sizeBefore, sizeAfter:sizeAfter, wrap:true, check:bundleConfig.minify}))
            .pipe( browserSync.reload( { stream: true } ) );
    }

    return bundle();
}

/**
 * The actual function of the browserify task.
 * Saved as a variable so we can export it for the wachify task.
 * @param opt_watch {=boolean} defines whether or not wachify is run.
 * @returns {stream}
 */
var browserifyTask = function ( opt_watch ) {

    var bundlesConfigs = createBundleConfigs();
    var streams = [];

    if(bundlesConfigs.length){

        for ( var i = 0, leni = bundlesConfigs.length; i < leni; i++ ) {
            streams.push( createBundle( bundlesConfigs[ i ], opt_watch ) );
        }

    } else {

        log.warn( { sender: 'browserify', message: 'No JavaScript files were found as an entry point?' } );

    }

    return mergeStream( streams );

}

// registers the browserify task for Gulp.
gulp.task( 'browserify', function () {

    return browserifyTask();

} );

module.exports = browserifyTask;
