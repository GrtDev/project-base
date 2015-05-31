// @formatter:off

var path                        = require('path');
var gulpUtil                    = require('gulp-util');
var prettyHrtime                = require('pretty-hrtime');
var notifier                    = require("node-notifier");

var humanFileSize               = require('./humanFileSize');


var bundleStartTime;

// @formatter:on

/**
 *  This file contains a collection of log functions to keep track of what is happening during the build process
 *
 *  gulpUtil.colors:
 *      - bold, dim, underline, inverse
 *      - red, green, yellow, blue, magenta, cyan, white, gray, black
 *      - bgRed, bgGreen, bgYellow, bgBlue, bgMagenta, bgCyan, bgWhite, bgBlack

 *  for more options
 *  @see: https://www.npmjs.com/package/chalk
 *
 */


/**
 * A collection of log functions specifically for the browserify bundle process.
 *
 * @type {{onStart: Function, watch: Function, onUglify: Function, onEnd: Function}}
 */
var bundleLogs = {

    /**
     * Returns a event listener function to be called at the start of the bundle process
     * @param fileName {string}
     * @returns {Function}
     */
    onStart: function (fileName) {

        return function () {
            bundleStartTime = process.hrtime();
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
    onUglify: function (uglifying, bundleName) {

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
    onEnd: function (fileName) {

        return function () {
            var taskTime = bundleStartTime ? prettyHrtime(process.hrtime(bundleStartTime)) : null;
            gulpUtil.log('Bundled:\t' + gulpUtil.colors.blue(fileName) + (taskTime ? ' in ' + gulpUtil.colors.magenta(taskTime) : ''));
        }

    }
};


var sizeLogs = {

    /**
     * Returns a event listener function that can be called to log the file size difference
     * @see: https://github.com/sindresorhus/gulp-size
     *
     * @param sizeBefore {object} gulp-size object
     * @param sizeAfter {object} gulp-size object
     * @param opt_doLog {boolean=} boolean check to actually perform the log
     * @returns {Function}
     */
    onDifference: function (sizeBefore, sizeAfter, opt_doLog) {


        return function () {
            
            sizeBefore = sizeBefore.size;
            sizeAfter = sizeAfter.size;

            if(opt_doLog === undefined || opt_doLog)
            {
                var difference = sizeBefore - sizeAfter;
                var message = 'Total size: ' + gulpUtil.colors.magenta(humanFileSize(sizeAfter, true));

                if(difference > 0) message += ', ( saved ' + gulpUtil.colors.cyan(humanFileSize(difference, true)) + ' )';
                else message += ', ( gained ' + gulpUtil.colors.red(humanFileSize(difference * -1, true)) + ' )';

                gulpUtil.log(message);
            }

        }

    }
};

function logError(error) {

    error.name = error.name || 'Error';
    error.message = error.message || 'No message...';
    error.stack = error.stack || 'No stack found...';
    error.fileName = error.fileName || 'No filename found...';
    error.plugin = error.plugin || 'Unkown plugin';

    error.title = error.name + ' (' + error.plugin + ')';

    notifier.notify({
        title: error.title,
        message: error.message.replace(/\"/g, '\\"'), // Make sure any quotes are properly escaped as this can break the notifier
        icon: path.resolve(__dirname, '../assets/gulp-error.png'),
        sound: false
    }, function (error, response) {
        console.log(error);
        console.log(response);
    });

    gulpUtil.log(gulpUtil.colors.red('[ ' + error.title + ' ]:'), error.message);
    gulpUtil.beep();

    //Keep gulp from hanging on this task
    this.emit('end');
};


/**
 * The complete collection of log functions to be used during the building process.
 *
 * @name log
 * @type {{error: logError, bundle: {onStart: Function, watch: Function, onUglify: Function, onEnd: Function}, size: {onDifference: Function}}}
 */
var log = {
    error: logError,
    bundle: bundleLogs,
    size: sizeLogs
};

module.exports = log;