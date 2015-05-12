// @formatter:off

var config              = require('../config');
var handleErrors        = require('../util/handleErrors');
var browserSync         = require('browser-sync');
var gulp                = require('gulp');
var browserify          = require('browserify');
var source              = require('vinyl-source-stream');
var bundleLogger        = require('../util/bundleLogger');
var mergeStream         = require('merge-stream');
var watchify            = require('watchify');
var buffer              = require('vinyl-buffer');
var uglify              = require('gulp-uglify');
var gulpif              = require('gulp-if');


function createBundleConfigs() {

    var main = {}
    main.fileName               = 'main.js';
    main.source                 = config.source.getPath('javascript', main.fileName);
    main.dest                   = config.dest.getPath('javascript');
    main.browserifyOptions      = {
        debug: config.debug // enables source maps
    };
    main.uglifyOptions          = {
        //
    }

    return [main];
}

//@formatter:on


function createBundle(bundleConfig, watch) {

    if(watch)
    {
        // A watchify require/external bug that prevents proper recompiling,
        // so (for now) we'll ignore these options during development. Running
        // `gulp browserify` directly will properly require and externalize.
        // @see: https://github.com/greypants/gulp-starter/blob/master/gulp/tasks/browserify.js

        delete bundleConfig.browserifyOptions['require'];
        delete bundleConfig.browserifyOptions['external'];
    }

    var browserifyInstance = browserify(bundleConfig.source, bundleConfig.browserifyOptions);

    if(watch)
    {
        // Wrap with watchify and rebundle on changes
        browserifyInstance = watchify(browserifyInstance);
        // Rebundle on update
        browserifyInstance.on('update', bundle);
        bundleLogger.watch(bundleConfig.fileName);

    } else
    {
        // Sort out shared dependencies.
        // browserifyInstance.require exposes modules externally
        if(bundleConfig.require) browserifyInstance.require(bundleConfig.require);
        // browserifyInstance.external excludes modules from the bundle, and expects
        // they'll be available externally
        if(bundleConfig.external) browserifyInstance.external(bundleConfig.external);

    }

    function bundle() {

        bundleLogger.start(bundleConfig.fileName);

        return browserifyInstance.bundle()
            .on('error', handleErrors)
            .pipe(source(bundleConfig.fileName))
            //
            .pipe(gulpif(bundleConfig.minify, bundleLogger.minify(bundleConfig.fileName)))
            .pipe(gulpif(bundleConfig.minify, buffer())) // convert from streaming to buffer object for uglify
            .pipe(gulpif(bundleConfig.minify, uglify(bundleConfig.uglifyOptions)))
            //
            .pipe(gulp.dest(bundleConfig.dest))
            .on('end', bundleLogger.end(bundleConfig.fileName))
            .pipe(browserSync.reload({stream: true}));
    }

    return bundle();
}

var browserifyTask = function (watch) {

    var bundlesConfigs = createBundleConfigs();
    var streams = [];

    for (var i = 0, leni = bundlesConfigs.length; i < leni; i++)
    {
        streams.push(createBundle(bundlesConfigs[i], watch));
    }

    return mergeStream(streams);

}

gulp.task('browserify', function () {

    return browserifyTask();

});

module.exports = browserifyTask;
