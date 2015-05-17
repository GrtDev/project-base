// @formatter:off

var gulpUtil                   = require('gulp-util');
var prettyHrtime            = require('pretty-hrtime');
var startTime;

// @formatter:on

/**
 *  Collection of log functions to keep track of what is happening during the Browserify build
 *
 *  gulpUtil.colors:
 *      - bold, dim, underline, inverse
 *      - red, green, yellow, blue, magenta, cyan, white, gray, black
 *      - bgRed, bgGreen, bgYellow, bgBlue, bgMagenta, bgCyan, bgWhite, bgBlack

 *  for more options
 *  @see: https://www.npmjs.com/package/chalk
 *
 * @type {{start: Function, watch: Function, uglifying: Function, end: Function}}
 */
module.exports = {

    /**
     * Returns a event listener function to be called at the start of the bundle process
     * @param fileName {string}
     * @returns {Function}
     */
    start: function (fileName) {

        return function () {
            startTime = process.hrtime();
            gulpUtil.log('Bundling...\t' + gulpUtil.colors.blue(fileName));
        }

    },

    /**
     * Logs the name of the bundle that is being watched.
     * @param bundleName {string}
     */
    watch: function (bundleName) {
        gulpUtil.log('Watching files required by', gulpUtil.colors.yellow(bundleName));
    },

    /**
     * Returns a event listener function to be called just before the Uglifying bundle process
     * @param uglifying {boolean} whether the bundle is going to start the uglifying process
     * @param bundleName {string}
     * @returns {Function}
     */
    uglifying: function (uglifying, bundleName) {

        return function () {
            if(uglifying) gulpUtil.log('Uglifying...\t' + gulpUtil.colors.green(bundleName));
        }

    },

    /**
     * Returns a event listener function to be called at the end of the bundle process
     * If 'start' was called it will also log the time the task has taken to complete.
     * @param fileName {string}
     * @returns {Function}
     */
    end: function (fileName) {

        return function () {
            var taskTime = startTime ? prettyHrtime(process.hrtime(startTime)) : null;
            gulpUtil.log('Bundled...\t' + gulpUtil.colors.blue(fileName) + (taskTime ? ' in ' + gulpUtil.colors.magenta(taskTime) : ''));
        }

    }
};