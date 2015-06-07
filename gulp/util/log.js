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
var gulpUtil                    = requireCachedModule('gulp-util');
var prettyHrtime                = requireCachedModule('pretty-hrtime');
var notifier                    = requireCachedModule("node-notifier");

// @formatter:on


/**
 * Log a message with size
 * Log a message with size
 * options:
 *  - sender {string}       sender of the message
 *  - message {string}      message
 *  - size {number}         gulpSizeObject
 *  - sizeAfter {number=}   gulpSizeObject to compare
 *  - wrap {boolean=}       wrap the log into a handler function
 *  - check {boolean=}      perform a boolean check before logging
 *
 * @param options {{sender: {string}, message: {string}, size: {object}, sizeAfter:{object} check: {boolean=}, wrap: {boolean=}}}
 */
function logSize ( options ) {

    if( options.wrap ) {

        options.wrap = false;
        return function () { logSize.call( this, options ) }

    } else {

        var sizeLog = humanFileSize( options.size.size, true );

        if( options.sizeAfter ) {
            var difference = options.size.size - options.sizeAfter.size;
            if( difference > 0 ) sizeLog = 'saved ' + humanFileSize( difference, true );
            else sizeLog = 'gained ' + humanFileSize( difference );
        }

        if( typeof options.check !== 'undefined' && !options.check ) return;
        console.log( gulpUtil.colors.blue( '[' + options.sender + '] size: ' + options.message ) + gulpUtil.colors.cyan( sizeLog ) );

    }

}
/**
 * Log a message with size
 * options:
 *  - sender {string}   sender of the message
 *  - message {string}  message
 *  - time {number}     time to log
 *  - wrap {boolean=}   wrap the log into a handler function
 *  - check {boolean=}  perform a boolean check before logging
 *
 * @param options {{sender: {string}, message: {string}, time: {number}, check: {boolean=}, wrap: {boolean=}}}
 */
function logTime ( options ) {

    if( options.wrap ) {

        options.wrap = false;
        return function () { logTime.call( this, options ) }

    } else {

        if( typeof options.check !== 'undefined' && !options.check ) return;
        console.log( gulpUtil.colors.blue( '[' + options.sender + '] time: ' + options.message ) + gulpUtil.colors.cyan( prettyHrtime( options.time ) ) );
    }

}

/**
 * Logs a debug message
 * options:
 *  - sender {string}   sender of the message
 *  - message {string}  message
 *  - data {Array=}      array with data to log
 *  - wrap {boolean=}   wrap the log into a handler function
 *  - check {boolean=}  perform a boolean check before logging
 *
 * @param options {{sender: {string}, message: {string}, data: {Array=}, check: {boolean=}, wrap: {boolean=}}}
 */
function logDebug ( options ) {

    if( options.wrap ) {

        options.wrap = false;
        return function () { logDebug.call( this, options ) }

    } else {

        if( typeof options.check !== 'undefined' && !options.check ) return;
        console.log.apply( this, [ gulpUtil.colors.blue( '[' + options.sender + '] debug: ' + options.message ) ].concat( options.data ? options.data : [] ) );

    }

}

/**
 * Logs a warning message
 * options:
 *  - sender {string}   sender of the message
 *  - message {string}  message
 *  - data {Array=}      array with data to log
 *  - wrap {boolean=}   wrap the log into a handler function
 *  - check {boolean=}  perform a boolean check before logging
 *
 * @param options {{sender: {string}, message: {string}, data: {Array=}, check: {boolean=}, wrap: {boolean=}}}
 */
function logWarn ( options ) {

    if( options.wrap ) {

        options.wrap = false;
        return function () { logDebug.call( this, options ) }

    } else {

        if( typeof options.check !== 'undefined' && !options.check ) return;
        console.log.apply( this, [ gulpUtil.colors.yellow( '[' + options.sender + '] warn: ' + options.message ) ].concat( options.data ? options.data : [] ) );

    }

}

/**
 * Logs a info message
 * options:
 *  - sender {string}   sender of the message
 *  - message {string}  message
 *  - data {Array=}      array with data to log
 *  - wrap {boolean=}   wrap the log into a handler function
 *  - check {boolean=}  perform a boolean check before logging
 *
 * @param options {{sender: {string}, message: {string}, data: {Array=}, check: {boolean=}, wrap: {boolean=}}}
 */
function logInfo ( options ) {

    if( options.wrap ) {

        options.wrap = false;
        return function () { logDebug.call( this, options ) }

    } else {

        if( typeof options.check !== 'undefined' && !options.check ) return;
        console.log.apply( this, [ gulpUtil.colors.blue( '[' + options.sender + '] info: ' ) + gulpUtil.colors.cyan( options.message ) ].concat( options.data ? options.data : [] ) );
    }

}

/**
 * Logs error and throws a notification (if set in the config)
 * error:
 *  - name {string}         name of the error
 *  - sender {string}       sender of the error
 *  - plugin {string}       plugin of the error
 *  - message {string}      message
 *  - stack {string}        stack trace
 *  - fileName {string=}    name of the file
 *
 * @param error {Error|{name:{string}, sender:{string=}, plugin:{string=}, message:{string}, stack:{string=}, fileName:{string}}
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
 * @type {{time: logTime, size: logSize, debug: logDebug, info: logInfo, warn: logWarn, error: logError}}
 */
var log = {

    colors: gulpUtil.colors,

    time: logTime,
    size: logSize,

    debug: logDebug,
    info: logInfo,
    warn: logWarn,
    error: logError

};

module.exports = log;