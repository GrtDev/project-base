//@formatter:off

var config                  = require('../config');
var log                     = require('./log');

var gulpDebug               = require('gulp-debug');
var gulpPlumber             = require('gulp-plumber');
var gulpIf                  = require('gulp-if');

//@formatter:on


/**
 * Decorates the gulp.src function with default tasks such as plumber
 * and debug for better error handling and debugging.
 *
 * @see: https://www.timroes.de/2015/01/06/proper-error-handling-in-gulp-js/
 * @see: https://www.npmjs.com/package/gulp-plumber
 * @see: https://www.npmjs.com/package/gulp-debug
 * @function: decorate
 * @param gulp {Gulp}
 */
function decorate(gulp) {

    // prevents from being able to decorate gulp twice
    if(decorate.prototype._hasDecorated) return;
    decorate.prototype._hasDecorated = true;

    var options = {

        plumberConfig: {
            errorHandler: log.error
        },

        debugConfig: {
            title: 'gulp-debug:',
            minimal: true           // By default only relative paths are shown. Turn off minimal mode to also show cwd, base, path.
        }

    }

    var gulp_src = gulp.src;

    gulp.src = function () {
        return gulp_src.apply(gulp, arguments)
            .pipe(gulpPlumber(options.plumberConfig))
            .pipe(gulpIf(config.gulpDebug, gulpDebug(options.debugConfig)));
    }

};


module.exports = decorate;

