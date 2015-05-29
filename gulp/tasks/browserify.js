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

/**
 *  Creates a set of bundle configurations to be run with the browserify task.
 *  Add your own configuration to the output Array.
 * @returns [ {object} ] Array with bundle configuration objects
 */
function createBundleConfigs() {

    // TODO automate source location to dest.

    var main = {}
    main.fileName               = 'main.js';
    main.source                 = config.source.getPath('javascript', main.fileName);
    main.dest                   = config.dest.getPath('javascript');
    main.browserifyOptions      = {
        debug: config.debug // enables source maps
    };

    // Minify files with UglifyJS.
    // @see: https://www.npmjs.com/package/gulp-uglify
    main.uglify                 = config.minify;
    main.uglifyOptions          = {
        mangle: true, // Pass false to skip mangling names.
        preserveComments: false // 'all', 'some', {function}
    }

    return [main];
}

//@formatter:on

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

        return browserifyInstance.bundle()
            // log the start and keep track of the task process time.
            .on('readable', log.bundle.onStart(bundleConfig.fileName))
            // Use vinyl-source-stream to make the
            // stream gulp compatible. Specify the
            // desired output filename here.
            .pipe(source(bundleConfig.fileName))
            //
            .on('end', log.bundle.onUglify(bundleConfig.uglify, bundleConfig.fileName))
            // convert from streaming to buffer object for uglify
            .pipe(gulpIf(bundleConfig.uglify,   buffer()))
            .pipe(gulpIf(bundleConfig.uglify,   sizeBefore))
            .pipe(gulpIf(bundleConfig.uglify,   uglify(bundleConfig.uglifyOptions)))
            // Specify the output destination
            .pipe(gulp.dest(bundleConfig.dest))
            //
            .pipe(gulpIf(bundleConfig.uglify,   sizeAfter))
            .on('end', log.size.onDifference(sizeBefore, sizeAfter, bundleConfig.uglify))

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
