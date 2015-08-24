//@formatter:off

var config                  = require('../config');
var log                     = require('./log');
var requireCachedModule     = require('./requireCachedModule');

var gulpDebug               = requireCachedModule('gulp-debug');
var gulpPlumber             = requireCachedModule('gulp-plumber');
var gulpIf                  = requireCachedModule('gulp-if');

//@formatter:on


var options = {

    plumberConfig: {
        errorHandler: log.error
    },

    debugConfig: {
        title: 'gulp-debug:',
        minimal: true           // By default only relative paths are shown. Turn off minimal mode to also show cwd, base, path.
    }

}

// for lazy loading
var _loadedTasks = {};
var _isDecorated;
var _gulp;

var decorator = {

    decorate: function ( gulp ) {

        _gulp = gulp;

        if( _isDecorated ) return;
        _isDecorated = true;

        decorateSrc( options );
        decorateTask();

        if( config.gulp.lazy ) {

            decorateStart();
            decorateHasTask();

        }

    }
}


module.exports = decorator;

/**
 * Decorates the gulp.src function with default tasks such as plumber
 * and debug for better error handling and debugging.
 *
 * @see: https://www.timroes.de/2015/01/06/proper-error-handling-in-gulp-js/
 * @see: https://www.npmjs.com/package/gulp-plumber
 * @see: https://www.npmjs.com/package/gulp-debug
 */
function decorateSrc ( options ) {


    // @type: {function}
    var gulpSrcFunction = _gulp.src;
    _gulp.src = function () {

        return gulpSrcFunction.apply( _gulp, arguments )
            .pipe( gulpPlumber( options.plumberConfig ) )
            .pipe( gulpIf( config.gulp.debug, gulpDebug( options.debugConfig ) ) );

    }
}

/**
 *  Decorates the gulp.task to catch errors and provides better error information such as stack traces.
 */
function decorateTask () {

    // @type: {function}
    var gulpTaskFunction = _gulp.task;

    _gulp.task = function () {

        if( config.gulp.debug ) log.debug( { sender: 'gulpDecorator', message: 'gulp.task()', data: [ arguments ] } );

        var taskIndex;
        var taskFunction;

        if( Array.isArray( arguments[ 1 ] ) ) {

            taskIndex = 2;
            taskFunction = arguments[ taskIndex ];

            // preload dependencies if needed
            if( config.gulp.lazy ) {

                var taskDependencies = arguments[ 1 ];
                if( config.gulp.debug ) {
                    log.debug( {
                        sender: 'gulpDecorator',
                        message: 'gulp.task() - dependencies: ',
                        data: [ taskDependencies ]
                    } );
                }

                for ( var i = 0, leni = taskDependencies.length; i < leni; i++ ) lazyLoadTask( taskDependencies[ i ] );

            }

        } else {

            taskIndex = 1;
            taskFunction = arguments[ taskIndex ];

        }

        if( config.gulp.debug ) {
            log.debug( {
                sender: 'gulpDecorator',
                message: 'Modifying gulp task ( ' + log.colors.cyan( arguments[ 0 ] ) + ' ) for for better error handling...'
            } );
        }


        var wrappedTaskFunction;
        if( typeof taskFunction === 'function' ) {

            wrappedTaskFunction = wrapTaskFunction( taskFunction );
            if( wrappedTaskFunction ) arguments[ taskIndex ] = wrappedTaskFunction;

        } else {

            if( config.gulp.debug ) log.warn( {
                sender: 'gulpDecorator',
                message: 'Failed to find the task function for task: ',
                data: [ arguments[ 0 ] ]
            } );

        }


        gulpTaskFunction.apply( _gulp, arguments );

    }
}


/**
 * Adds lazy loading capabilities
 * We need to decorate both the 'start' and 'hasTask' functions
 * because some plugins (runSequence) check if the task has been loaded before they run.
 */
function decorateStart () {

    if( config.gulp.debug ) log.debug( { sender: 'gulpDecorator', message: 'Modifying gulp for lazy loading...' } );

    var gulpStartFunction = _gulp.start;


    _gulp.start = function () {

        if( config.gulp.debug ) log.debug( { sender: 'gulpDecorator', message: 'gulp.start()', data: [ arguments ] } );

        for ( var i = 0, leni = arguments.length; i < leni; i++ ) {

            if( typeof arguments[ i ] !== 'string' ) {

                // this is probably not an error but just a given callback ('function')
                if( config.gulp.verbose ) log.warn( { sender: 'gulpDecorator', message: 'Can not load a function.' } );
                continue;
            }

            lazyLoadTask( arguments[ i ] );

        }


        gulpStartFunction.apply( _gulp, arguments );
    }
}

function decorateHasTask () {

    var gulpHasTaskFunction = _gulp.hasTask;

    /**
     * Some modules (runSequence) check whether the plugin has been registered before trying to run it.
     * Therefor we need to load the task before it gets checked.
     * @see: https://github.com/orchestrator/orchestrator
     * @param taskName {string}
     */
    _gulp.hasTask = function ( taskName ) {

        if( config.gulp.debug ) log.debug( {
            sender: 'gulpDecorator',
            message: 'hasTask( ' + log.colors.cyan( taskName ) + ' )'
        } );

        lazyLoadTask( taskName );

        return gulpHasTaskFunction.apply( _gulp, [ taskName ] );

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

    if( _loadedTasks[ taskName ] === undefined ) {

        try {

            var taskPath = '../tasks/' + taskName;

            if( config.gulp.debug )log.debug( {
                sender: 'gulpDecorator',
                message: 'lazy loading:\t\'' + log.colors.cyan( taskName ) + '\' ( ' + taskPath + ' )'
            } );

            _loadedTasks[ taskName ] = require( taskPath );


        } catch ( error ) {

            _loadedTasks[ taskName ] = false;
            
            // Some tasks won't be able to load if they are not in a separate file.
            // So if it fails it is not necessarily an error.
            if( config.gulp.debug )
            log.warn( {
                sender: 'gulpDecorator',
                message: 'warning: Failed to lazy load task: ' + taskPath + '.js',
                data: error
            } );

        }

    }
}

function wrapTaskFunction ( taskFunction ) {

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
                return taskFunction.apply( _gulp, arguments );
            }
            catch ( error ) {
                console.log('log error');
                log.error( error, true, true );
            }
        }

    } else if( taskParams.length && taskParams[ 0 ] === 'callback' ) {

        // wrapper needs a 'callback' param!
        wrappedTaskFunction = function ( callback ) {
            try {
                return taskFunction.apply( _gulp, arguments );
            }
            catch ( error ) {
                log.error( error, true, true );
            }
        }

    } else {

        log.warn( {
            sender: 'gulpDecorator',
            message: 'Ran into unknown parameters when trying to wrap the task function: ',
            data: [ taskParams ]
        } )

    }

    return wrappedTaskFunction;

}


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

