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

// @formatter:off

var requireCachedModule         = require('./requireCachedModule');
var humanFileSize               = require('./humanFileSize');
var config                      = require('../config');

var path                        = require('path');
var gulpUtil                    = require('gulp-util');
var prettyHrtime                = requireCachedModule('pretty-hrtime');
var notifier                    = requireCachedModule("node-notifier");

// @formatter:on


/**
 * Log a message with size
 * @param sender {string}
 * @param message {string}
 * @param size {number}
 * @param optSizeAfter {number}
 * @param opt_wrap {boolean}
 */
function logSize ( sender, message, size, optSizeAfter, opt_wrap ) {

    if( opt_wrap ) {

        return function () { logSize.call( this, sender, message, size, optSizeAfter, false ) }

    } else {

        var sizeLog = humanFileSize( size );

        if( optSizeAfter ) {
            var difference = size - optSizeAfter;
            if( difference > 0 ) sizeLog = 'saved ' + humanFileSize( difference );
            else sizeLog = 'gained ' + humanFileSize( difference );
        }

        console.log( gulpUtil.colors.blue( '[' + sender + ']\t' + message ) + gulpUtil.colors.cyan( sizeLog ) );

    }

}
/**
 * Log a message with size
 * @param sender {string}
 * @param message {string}
 * @param time {number}
 * @param opt_wrap {boolean}
 */
function logTime ( sender, message, time, opt_wrap ) {

    if( opt_wrap ) {

        return function () { logTime.call( this, sender, message, size, false ) }

    } else {

        console.log( gulpUtil.colors.blue( '[' + sender + '] ' + message ) + gulpUtil.colors.cyan( prettyHrtime( time ) ) );
    }

}

/**
 * Logs a debug message
 * @param sender {string}
 * @param message {string|Array}
 * @param opt_data {Array=} data to log
 * @param opt_wrap {boolean=} will wrap the log into another function if true.
 * @param opt_doLog {boolean=} boolean check on whether to actually do the log
 * @returns {Function=}
 */
function logDebug ( sender, message, opt_data, opt_wrap, opt_doLog ) {

    if( opt_wrap ) {

        return function () { logDebug.call( this, sender, message, false, opt_doLog ) }

    } else {

        if( typeof opt_doLog !== 'undefined' && !opt_doLog ) return;
        console.log.apply( this, [ gulpUtil.colors.blue( '[' + sender + '] debug: ' + message ) ].concat( opt_data ? opt_data : []  ) );

    }

}

/**
 * Logs a warning message
 * @param sender {string}
 * @param message {string|Array}
 * @param opt_data {Array=} data to log
 * @param opt_wrap {boolean=} will wrap the log into another function if true.
 * @param opt_doLog {boolean=} boolean check on whether to actually do the log
 * @returns {Function=}
 */
function logWarn ( sender, message, opt_data, opt_wrap, opt_doLog ) {

    if( opt_wrap ) {

        return function () { logWarn.call( this, sender, message, false, opt_doLog ) }

    } else {

        if( typeof opt_doLog !== 'undefined' && !opt_doLog ) return;
        console.log.apply( this, [ gulpUtil.colors.yellow( '[' + sender + '] warn: ' + message ) ].concat( opt_data ? opt_data : []  ) );
    }

}

/**
 * Logs a info message
 * @param sender {string}
 * @param message {string|Array}
 * @param opt_data {Array=} data to log
 * @param opt_wrap {boolean=} will wrap the log into another function if true.
 * @param opt_doLog {boolean=} boolean check on whether to actually do the log
 * @returns {Function=}
 */
function logInfo ( sender, message, opt_data, opt_wrap, opt_doLog ) {

    if( opt_wrap ) {

        return function () { logInfo.call( this, sender, message, null, false, opt_doLog ) }

    } else {

        if( typeof opt_doLog !== 'undefined' && !opt_doLog ) return;
        console.log.apply( this, [ gulpUtil.colors.blue( '[' + sender + '] info: ' ) + gulpUtil.colors.cyan( message ) ].concat( opt_data ? opt_data : [] ) );
    }

}

/**
 * Logs error and throws a notification (if set in the config)
 * @param error {Error|object}
 * @param opt_stack {boolean=} deploy a stack trace in the console
 * @param opt_exit {boolean=} kill the process
 */
function logError ( error, opt_stack, opt_exit ) {

    // @formatter:off

    error.name      = error.name        || 'Error';
    error.message   = error.message     || 'No message...';
    error.stack     = error.stack       || 'No stack found...';
    error.fileName  = error.fileName    || 'No filename found...';

    //@formatter:on

    var title = error.name;

    if( error.plugin ) title += ' [' + (error.plugin) + ']';
    else if( error.sender ) title += ' [' + error.sender + ']';


    if( config.notifyErrors ) {

        notifier.notify( {

            title: title,
            message: error.message.replace( /\"/g, '\\"' ), // Make sure any quotes are properly escaped as this can break the notifier
            icon: path.resolve( __dirname, '../assets/gulp-error.png' ),
            sound: false

        }, function ( notifyError, notifyResponse ) {

            // just in case
            if( notifyError ) console.log( notifyError );
            if( notifyResponse ) console.log( notifyResponse );

        } );

    }


    var message;
    var stackTrace;

    if( opt_stack && error.stack ) {

        stackTrace = error.stack;
        stackTrace = stackTrace.replace( new RegExp( '^' + error.name + '.*' ), '' );

    }

    message = error.message;
    message = message.replace( new RegExp( '^' + error.name + '' ), '' );
    message = gulpUtil.colors.red( title, message );

    console.log( message + (stackTrace ? stackTrace : '') );
    gulpUtil.beep();

    //Keep gulp from hanging on this task
    if( this.emit ) this.emit( 'end' );

    // kill the process if necessary
    if( opt_exit ) process.exit( 1 );
};


/**
 * The complete collection of log functions to be used during the building process.
 * @name log
 * @type {{time: logTime, size: logSize, error: logError, debug: logDebug, warn: logWarn, info: logInfo}}
 */
var log = {

    time: logTime,
    size: logSize,
    error: logError,
    debug: logDebug,
    warn: logWarn,
    info: logInfo

};

module.exports = log;