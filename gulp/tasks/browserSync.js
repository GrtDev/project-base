// @formatter:off

var browserSync     = require('browser-sync');
var gulp            = require('gulp');
var config          = require('../config');

//@formatter:on


/**
 * Task to run BrowserSync.
 * @see http://www.browsersync.io/
 */
gulp.task('browserSync', function () {

    var options = {

        server: {
            // Serve up our build folder
            baseDir: config.dest.getPath('root'),

            // Enables CORS to solve cross domain issues
            // @see https://hondo.wtf/2015/02/15/enable-cors-in-browsersync
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
        }

    }

    browserSync(options);

});