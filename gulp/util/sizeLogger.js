// @formatter:off

var gulpUtil                    = require('gulp-util');
var humanFileSize               = require('./humanFileSize');

// @formatter:on

/**
 *  Collection of log functions to keep track file size changes
 *
 *  gulpUtil.colors:
 *      - bold, dim, underline, inverse
 *      - red, green, yellow, blue, magenta, cyan, white, gray, black
 *      - bgRed, bgGreen, bgYellow, bgBlue, bgMagenta, bgCyan, bgWhite, bgBlack

 *  for more options
 *  @see: https://www.npmjs.com/package/chalk
 *
 * @type {{difference: Function}}
 */
module.exports = {

    /**
     * Returns a event listener function that can be called to log the file size difference
     * @see: https://github.com/sindresorhus/gulp-size
     *
     * @param sizeBefore {object} gulp-size object
     * @param sizeAfter {object} gulp-size object
     * @param opt_doLog {boolean=} boolean check to actually perform the log
     * @returns {Function}
     */
    difference: function (sizeBefore, sizeAfter, opt_doLog) {


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