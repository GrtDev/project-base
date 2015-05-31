// @formatter:off

var config                  = require('../config');
var log                     = require('../util/log');

var browserSync             = require('browser-sync');
var gulp                    = require('gulp');
var browserify              = require('browserify');
var source                  = require('vinyl-source-stream');
var mergeStream             = require('merge-stream');
var watchify                = require('watchify');
var buffer                  = require('vinyl-buffer');
var uglify                  = require('gulp-uglify');
var gulpIf                  = require('gulp-if');
var gulpSize                = require('gulp-size');
var sourcemaps              = require('gulp-sourcemaps');
var glob                    = require('glob');
var path                    = require('path');


//@formatter:on

/**
 *  Creates a set of bundle configurations to be run with the browserify task.
 *  Add your own configuration to the output Array.
 * @returns [ {object} ] Array with bundle configuration objects
 */
function createBundleConfigs() {

    // Set your default options here
    var options = {

        source: config.source.getPath('javascript', '!(' + config.ignorePrefix + ')*.js'),
        dest:   config.dest.getPath('javascript'),


        // Minify files with UglifyJS.
        // @see: https://www.npmjs.com/package/gulp-uglify
        uglify:         config.minify,
        uglifyOptions:  {
            mangle: true, // Pass false to skip mangling names.
            preserveComments: false // 'all', 'some', {function}
        }

    }


    var fileEntries = glob.sync(options.source);
    var bundleConfigs = [];

    for (var i = 0, leni = fileEntries.length; i < leni; i++)
    {
        var entry = fileEntries[i];
        var name = path.basename(entry);
        var bundleConfig = createBundleConfig(name, entry, options)
        bundleConfigs.push(bundleConfig);
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
function createBundleConfig(fileName, filePath, options) {

    if(!fileName) return log.error({message: 'fileName can not be null!', plugin: 'browserify task'});
    if(!filePath) return log.error({message: 'filePath can not be null!', plugin: 'browserify task'});

    var bundleConfig = {}
    options = options || {};

    bundleConfig.fileName = fileName;
    bundleConfig.source = filePath;
    bundleConfig.dest = options.dest || config.dest.getPath('javascript');

    bundleConfig.browserifyOptions = options.browserifyOptions || {
        debug: true // always enable source maps
    };

    bundleConfig.uglify = (options.uglify !== undefined) ? options.uglify : config.minify;
    bundleConfig.uglifyOptions = options.uglifyOptions || {
        mangle: true, // Pass false to skip mangling names.
        preserveComments: false // 'all', 'some', {function}
    }

    return bundleConfig;
}

/**
 * Creates a bundle for the given configuration.
 * @param bundleConfig {object} configuration for the bundle.
 * @param opt_watch {=boolean} whether wacify is used.
 * @returns {stream}
 */
function createBundle(bundleConfig, opt_watch) {

    if(opt_watch)
    {
        // A watchify require/external bug that prevents proper recompiling,
        // so (for now) we'll ignore these options during development. Running
        // `gulp browserify` directly will properly require and externalize.
        // @see: https://github.com/greypants/gulp-starter/blob/master/gulp/tasks/browserify.js

        delete bundleConfig.browserifyOptions['require'];
        delete bundleConfig.browserifyOptions['external'];
    }

    var browserifyInstance = browserify(bundleConfig.source, bundleConfig.browserifyOptions);

    if(opt_watch)
    {
        // Wrap with watchify and rebundle on changes
        browserifyInstance = watchify(browserifyInstance);
        // Rebundle on update
        browserifyInstance.on('update', bundle);
        // log that we are watching this bundle
        log.bundle.watch(bundleConfig.fileName);

    } else
    {
        // Sort out shared dependencies.
        // browserifyInstance.require exposes modules externally
        if(bundleConfig.require) browserifyInstance.require(bundleConfig.require);
        // browserifyInstance.external excludes modules from the bundle, and expects
        // they'll be available externally
        if(bundleConfig.external) browserifyInstance.external(bundleConfig.external);

    }

    /**
     * Creates a bundle of the current config.
     * @returns {stream}
     */
    function bundle() {

        // Keep track of the file size changes
        // @see: https://github.com/sindresorhus/gulp-size
        var sizeBefore = gulpSize({showFiles: true});
        var sizeAfter = gulpSize({showFiles: true});

        // TODO: Fix file size logs

        return browserifyInstance.bundle()
            // log the start and keep track of the task process time.
            .on('readable', log.bundle.onStart(bundleConfig.fileName))
            // Use vinyl-source-stream to make the
            // stream gulp compatible. Specify the
            // desired output filename here.
            .pipe(source(bundleConfig.fileName))
            //
            .on('end', log.bundle.onUglify(bundleConfig.uglify, bundleConfig.fileName))

            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            // convert from streaming to buffer object for uglify
            //.pipe(gulpIf(bundleConfig.uglify,   sizeBefore))
            .pipe(gulpIf(bundleConfig.uglify, uglify(bundleConfig.uglifyOptions)))

            .pipe(sourcemaps.write('./'))
            // Specify the output destination
            .pipe(gulp.dest(bundleConfig.dest))
            //
            .pipe(gulpIf(bundleConfig.uglify, sizeAfter))
            //.on('end', log.size.onDifference(sizeBefore, sizeAfter, bundleConfig.uglify))

            // log the end of the bundle task and calculate the task time.
            .on('end', log.bundle.onEnd(bundleConfig.fileName))
            .pipe(browserSync.reload({stream: true}));
    }

    return bundle();
}

/**
 * The actual function of the browserify task.
 * Saved as a variable so we can export it for the wachify task.
 * @param opt_watch {=boolean} defines whether or not wachify is run.
 * @returns {stream}
 */
var browserifyTask = function (opt_watch) {

    var bundlesConfigs = createBundleConfigs();
    var streams = [];

    for (var i = 0, leni = bundlesConfigs.length; i < leni; i++)
    {
        streams.push(createBundle(bundlesConfigs[i], opt_watch));
    }

    return mergeStream(streams);

}

// defines the browserify task for Gulp.
gulp.task('browserify', function () {

    return browserifyTask();

});

module.exports = browserifyTask;
