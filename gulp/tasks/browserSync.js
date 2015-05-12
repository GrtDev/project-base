// @formatter:off

var browserSync     = require('browser-sync');
var gulp            = require('gulp');
var config          = require('../config');

//@formatter:on



gulp.task('browserSync', function () {

    var options = {
        server: {
            // Serve up our build folder
            baseDir: config.dest.root
        }
    }

    browserSync(options);

});