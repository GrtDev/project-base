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

        if( config.verbose ) console.log( '[gulpDecorator] debug: gulp.task()', arguments );


        var taskIndex;
        var taskFunction;

        if( Array.isArray( arguments[ 1 ] ) ) {

            taskIndex = 2;
            taskFunction = arguments[ taskIndex ];

            // preload dependencies if needed
            if( config.gulp.lazy ) {

                var taskDependencies = arguments[ 1 ];

                for ( var i = 0, leni = taskDependencies.length; i < leni; i++ ) {
                    var task = taskDependencies[ i ];
                    lazyLoadTask( task );
                }
            }

        } else {

            taskIndex = 1;
            taskFunction = arguments[ taskIndex ];

        }

        if( config.gulp.debug ) {

            if( config.verbose ) console.log( '[gulpDecorator] debug: Modifying gulp for for better error handling...' );

            var wrappedTaskFunction = function () {

                try { return taskFunction.apply( gulp, arguments ); }
                catch ( error ) {
                    log.error( error, true, true )
                }

            }

            arguments[ taskIndex ] = wrappedTaskFunction;
        }


        gulpTaskFunction.apply( gulp, arguments );

    }

    /**
     * Adds lazy loading capabilities
     * We need to decorate both the 'start' and 'hasTask' functions
     * because some plugins (runSequence) check if the task has been loaded before they run.
     */
    if( config.gulp.lazy ) {

        if( config.verbose ) console.log( '[gulpDecorator] debug: Modifying gulp for lazy loading...' );


        var gulpStartFunction = gulp.start;
        var gulpHasTaskFunction = gulp.hasTask;

        gulp.start = function () {

            if( config.verbose ) console.log( '[gulpDecorator] debug: start', arguments );

            for ( var i = 0, leni = arguments.length; i < leni; i++ ) {

                if( typeof arguments[ i ] !== 'string' ) {

                    // this is probably not an error but just a given callback ('function')
                    if( config.verbose ) console.log( '[gulpDecorator] debug: Can not load a function.' );
                    continue;
                }

                lazyLoadTask( arguments[ i ] );

            }


            gulpStartFunction.apply( gulp, arguments );
        }

        /**
         * @see: https://github.com/orchestrator/orchestrator
         * @param taskName {string}
         */
        gulp.hasTask = function ( taskName ) {

            if( config.verbose ) console.log( '[gulpDecorator] debug: hasTask( ' + taskName + ' )' );

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

                if( config.verbose ) console.log( '[gulpDecorator] lazy loading:\t\'' + taskName + '\'' );
                loadedTasks[ taskName ] = require( '../tasks/' + taskName );

            } catch ( error ) {

                if( config.verbose ) console.log( '[gulpDecorator] warning: Failed to lazy load task: ' + taskName );

            }

        }
    }


};


module.exports = decorate;

