// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var config                  = require('../config');

var browserSync             = requireCachedModule('browser-sync');
var gulp                    = requireCachedModule('gulp');

//@formatter:on


/**
 * Task to run BrowserSync.
 * BrowserSync makes your tweaking and testing faster by synchronising
 * file changes and interactions across multiple devices
 * @see http://www.browsersync.io/
 */
gulp.task('browserSync', function () {

    var options = {

        // ghostMode: false,

        // port: 3000,

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