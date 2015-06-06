// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var config                  = require('../config');

var gulp                    = requireCachedModule('gulp');
var browserSync             = requireCachedModule('browser-sync');


/**
 * Task for watching files and running related tasks when needed.
 * JavaScript is done via watchify instead for this task for optimized configuration.
 * @see https://www.npmjs.com/package/gulp-watch
 */
gulp.task('watch', ['watchify'], function (callback) {

    gulp.watch(config.source.getPath('images',  '**/*.{jpg|jpeg|gif|svg|png}'),     ['images']);
    gulp.watch(config.source.getPath('css',     '**/*.scss'),                       ['sass']);
    gulp.watch(config.source.getPath('markup',  '**'),                              ['handlebars']);

});

// @formatter:on