//@formatter:off

var gulpDebug               = require('gulp-debug');
var gulpPlumber             = require('gulp-plumber');
var log                     = require('./log');

//@formatter:on


/**
 * Decorates the gulp.src function with the plumber task to add proper error handling.
 *
 * @see: https://www.npmjs.com/package/gulp-plumber
 * @see: https://www.timroes.de/2015/01/06/proper-error-handling-in-gulp-js/
 * @function: gulpPlumberDecorator
 * @param gulp {Gulp}
 */
function gulpPlumberDecorator(gulp) {

    // prevents from beging able to decorate gulp twice
    if(gulpPlumberDecorator.prototype._hasDecorated) return;
    gulpPlumberDecorator.prototype._hasDecorated = true;

    var gulp_src = gulp.src;

    var options = {
        errorHandler: log.error
    }

    gulp.src = function () {
        return gulp_src.apply(gulp, arguments)
            .pipe(gulpPlumber(options)
        );
    }

};

/**
 * Decorates the gulp.src function with the gulp-debug task to add extra file logs for debug purposes.
 *
 * @see: https://www.npmjs.com/package/gulp-debug
 * @function: gulpDebugDecorator
 * @param gulp {Gulp}
 */
function gulpDebugDecorator(gulp) {

    // prevents from beging able to decorate gulp twice
    if(gulpDebugDecorator.prototype._hasDecorated) return;
    gulpDebugDecorator.prototype._hasDecorated = true;

    var gulp_src = gulp.src;

    var options = {
        title: 'gulp-debug:',
        minimal: true           // By default only relative paths are shown. Turn off minimal mode to also show cwd, base, path.
    }

    gulp.src = function () {
        return gulp_src.apply(gulp, arguments)
            .pipe(gulpDebug(options)
        );
    }

};


var decorator = {
    plumber: gulpPlumberDecorator,
    debug: gulpDebugDecorator
}

module.exports = decorator;

