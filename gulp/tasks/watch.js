// @formatter:off

var gulp                    = require('gulp');
var config                  = require('../config');
var browserSync             = require('browser-sync');


/**
 * Task for watching files and running related tasks when needed.
 * JavaScript is done via watchify instead for this task for optimized configuration.
 * @see https://www.npmjs.com/package/gulp-watch
 */
gulp.task('watch', ['watchify'], function (callback) {

    gulp.watch(config.source.getPath('images',  '**/*.{jpg|jpeg|gif|svg|png}'),     ['images']);
    gulp.watch(config.source.getPath('css',     '**/*.scss'),                       ['sass']);
    gulp.watch(config.source.getPath('markup',  '**/*.hbs'),                        ['handlebars']);

});

// @formatter:on