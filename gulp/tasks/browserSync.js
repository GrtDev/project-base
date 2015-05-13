// @formatter:off

var browserSync     = require('browser-sync');
var gulp            = require('gulp');
var config          = require('../config');

//@formatter:on



gulp.task('browserSync', function () {

    var options = {
        server: {
            // Serve up our build folder
            baseDir: config.dest.root,
            // Solves cross domain security issues
            // @see https://hondo.wtf/2015/02/15/enable-cors-in-browsersync
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
        }
    }

    browserSync(options);

});