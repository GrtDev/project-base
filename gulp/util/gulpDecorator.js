//@formatter:off

var config                  = require('../config');
var log                     = require('./log');
var requireCachedModule     = require('./requireCachedModule');

var gulpDebug               = requireCachedModule('gulp-debug');
var gulpPlumber             = requireCachedModule('gulp-plumber');
var gulpIf                  = requireCachedModule('gulp-if');

//@formatter:on


/**
 * Decorates the gulp.src function with default tasks such as plumber
 * and debug for better error handling and debugging.
 * Also decorates the gulp.task to catch errors and provides better error information such as stack traces.
 *
 * @see: https://www.timroes.de/2015/01/06/proper-error-handling-in-gulp-js/
 * @see: https://www.npmjs.com/package/gulp-plumber
 * @see: https://www.npmjs.com/package/gulp-debug
 * @function: decorate
 * @param gulp {Gulp}
 */
function decorate ( gulp ) {

    // prevents from being able to decorate gulp twice
    if( decorate.prototype._hasDecorated ) return;
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

    var loadedTasks = {};

    // @type: {function}
    var gulpSrcFunction = gulp.src;
    gulp.src = function () {

        return gulpSrcFunction.apply( gulp, arguments )
            .pipe( gulpPlumber( options.plumberConfig ) )
            .pipe( gulpIf( config.gulp.debug, gulpDebug( options.debugConfig ) ) );

    }


    // @type: {function}
    var gulpTaskFunction = gulp.task;
    gulp.task = function () {

        if( config.gulp.debug ) log.debug( { sender: 'gulpDecorator', message: 'gulp.task()', data: [ arguments ] } );

        var taskIndex;
        var taskFunction;

        if( Array.isArray( arguments[ 1 ] ) ) {

            taskIndex = 2;
            taskFunction = arguments[ taskIndex ];

            // preload dependencies if needed
            if( config.gulp.lazy ) {

                var taskDependencies = arguments[ 1 ];
                for ( var i = 0, leni = taskDependencies.length; i < leni; i++ ) lazyLoadTask( taskDependencies[ i ] );

            } else {

                taskIndex = 1;
                taskFunction = arguments[ taskIndex ];

            }


            if( config.verbose ) log.debug( {
                sender: 'gulpDecorator',
                message: 'Modifying gulp task ( ' + arguments[ 0 ] + ' ) for for better error handling...'
            } );

            if( typeof taskFunction === 'function' ) {

                var taskParams = getParamNames( taskFunction );
                var wrappedTaskFunction;

                /**
                 *  Gulp (or maybe orchestra) checks the task parameters for a callback param.
                 *  So we need to properly give the wrapper function a 'callback' param as well.
                 *  If we don't some function might break down (runSequence for example).
                 */
                if( !taskParams || !taskParams.length ) {

                    wrappedTaskFunction = function () {
                        try {
                            return taskFunction.apply( gulp, arguments );
                        }
                        catch ( error ) {
                            log.error( error, true, true );
                        }
                    }

                } else if( taskParams.length && taskParams[ 0 ] === 'callback' ) {

                    // wrapper needs a 'callback' param!
                    wrappedTaskFunction = function ( callback ) {
                        try {
                            return taskFunction.apply( gulp, arguments );
                        }
                        catch ( error ) {
                            log.error( error, true, true );
                        }
                    }

                } else {

                    log.error( {
                        sender: 'gulpDecorator',
                        message: 'Ran into unknown parameters when trying to wrap the task function: ',
                        data: [ taskParams ]
                    } )

                }

                if( wrappedTaskFunction ) arguments[ taskIndex ] = wrappedTaskFunction;

            } else {

                if( config.verbose ) log.warn( 'Failed to find the task function for task: ' + arguments[ 0 ] );

            }

            gulpTaskFunction.apply( gulp, arguments );

        }

    };


    /**
     * Adds lazy loading capabilities
     * We need to decorate both the 'start' and 'hasTask' functions
     * because some plugins (runSequence) check if the task has been loaded before they run.
     */
    if( config.gulp.lazy ) {

        if( config.verbose ) log.debug( { sender: 'gulpDecorator', message: 'Modifying gulp for lazy loading...' } );

        var gulpStartFunction = gulp.start;
        var gulpHasTaskFunction = gulp.hasTask;

        gulp.start = function () {

            if( config.verbose ) log.debug( { sender: 'gulpDecorator', message: 'gulp.start()', data: [ arguments ] } );

            for ( var i = 0, leni = arguments.length; i < leni; i++ ) {

                if( typeof arguments[ i ] !== 'string' ) {

                    // this is probably not an error but just a given callback ('function')
                    if( config.verbose ) log.warn( { sender: 'gulpDecorator', message: 'Can not load a function.' } );
                    continue;
                }

                lazyLoadTask( arguments[ i ] );

            }


            gulpStartFunction.apply( gulp, arguments );
        }

        /**
         * Some modules (runSequence) check whether the plugin has been registered before trying to run it.
         * Therefor we need to load the task before it gets checked.
         * @see: https://github.com/orchestrator/orchestrator
         * @param taskName {string}
         */
        gulp.hasTask = function ( taskName ) {

            if( config.verbose ) log.debug( {
                sender: 'gulpDecorator',
                message: 'hasTask( ' + log.colors.cyan( taskName ) + ' )'
            } );

            lazyLoadTask( taskName );

            return gulpHasTaskFunction.apply( gulp, [ taskName ] );

        }
    }

    /**
     * Check if the task has been loaded, if not try to load it.
     * @param taskName
     */
    function lazyLoadTask ( taskName ) {

        if( !config.gulp.lazy ) return log.error( {
            message: 'Trying to lazy load a task, but gulp is not set in lazy mode?!',
            sender: 'gulpDecorator'
        } );

        if( typeof loadedTasks[ taskName ] === 'undefined' ) {

            try {

                if( config.verbose )log.debug( {
                    sender: 'gulpDecorator',
                    message: 'lazy loading:\t\'' + log.colors.cyan( taskName ) + '\''
                } );

                loadedTasks[ taskName ] = require( '../tasks/' + taskName );

            } catch ( error ) {

                // Some tasks won't be able to load if they are not in a separate file.
                // So if it fails it is not necessarily an error.
                if( config.verbose ) log.warn( {
                    sender: 'gulpDecorator',
                    message: 'warning: Failed to lazy load task: ' + taskName
                } );

            }

        }
    }


}


module.exports = decorate;



var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
/**
 * Retrieves the parameter names for a given function
 * @see: http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript
 * @param functionReference
 * @returns {Array}
 */
function getParamNames ( functionReference ) {
    if( !functionReference ) return null;
    var fnStr = functionReference.toString().replace( STRIP_COMMENTS, '' );
    var result = fnStr.slice( fnStr.indexOf( '(' ) + 1, fnStr.indexOf( ')' ) ).match( ARGUMENT_NAMES );
    if( result === null ) result = [];
    return result;
};

