// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var config                  = require('../config');

var gulp                    = requireCachedModule('gulp');
var browserSync             = requireCachedModule('browser-sync');

var reloadTimeout;
var RELOAD_TIMEOUT_DELAY    = 200; // in milliseconds


/**
 * Task for watching files and running related tasks when needed.
 * JavaScript is done via watchify instead for this task for optimized configuration.
 * @see https://www.npmjs.com/package/gulp-watch
 */
gulp.task('watch', ['watchify'], function (callback) {

    gulp.watch(config.source.getPath('images',  '**/*.{jpg|jpeg|gif|svg|png}'),     ['images']);
    gulp.watch(config.source.getPath('css',     '**/*.scss'),                       ['sass']);
    gulp.watch(config.source.getPath('markup',  '**'),                              ['handlebars']);
    gulp.watch(config.dest.getPath('markup',    '**/*.html') ).on('change', onHTMLChange);

});

// @formatter:on

/**
 *  A separate function to refresh the browser. This is to bypass a known bug in chrome.
 *  see: https://github.com/BrowserSync/browser-sync/issues/155
 */
function onHTMLChange() {

    if(reloadTimeout) clearTimeout(reloadTimeout);
    reloadTimeout = setTimeout(browserSync.reload, RELOAD_TIMEOUT_DELAY);

}

