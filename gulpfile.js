// @formatter:off
var startTime               = process.hrtime();
var config                  = require('./gulp/config');

//---------------      B A S I C   S E T T I N G S      ----------------

// For ALL the default settings such as folder structure, bower dependencies and more check the actual 'gulp/config.js' file.

config.debug                = true;
config.minify               = false;
config.verbose              = false;
config.notifyErrors         = true;
config.gulp.debug           = false;

// ---------------------------------------------------------------------


// Load / Index all the plugins for faster task loading.
require('./gulp/util/loadPlugins')(init, true, global);

function init() {

    require('./gulp/util/loadTasks')(); // load tasks

    var requireCachedModule = require('./gulp/util/requireCachedModule');
    var gulpDecorator       = require('./gulp/util/gulpDecorator');
    var log                 = require('./gulp/util/log');
    var gulp                = requireCachedModule('gulp');
    var runSequence         = requireCachedModule('run-sequence');

    gulpDecorator.decorate(gulp); // Decorate gulp with extra functionality for better debugging and error handling.

    log.time( { sender: 'gulpfile', message: 'init - ', time: process.hrtime( startTime ) } );



    //--------------     M A I N   T A S K S    L I S T     --------------

    // Specifies the default set of tasks to run when you run `gulp`.
    gulp.task( 'default', [ 'server' ] );


    /**
     *  @task server
     *  Build the project.
     *  Fires up a local server.
     *  Starts watching all the used files and rebuilds on file changes.
     *  - This will also automatically refresh your browser after something has been rebuild.
     */
    gulp.task( 'server', function ( callback ) {

        runSequence(
            'build',
            'browserSync',
            'watch',
            callback
        );

    } );


    /**
     *  @task build
     *  Deletes the olds files and builds the project from scratch.
     */
    gulp.task( 'build', function ( callback ) {

        runSequence(
            'clean',
            'copyAssets',
            'copyBower',
            'images',
            'svg',
            'handlebars',
            'browserify',
            'sass',
            callback
        );

    } );


    /**
     * @task build:dist
     * Builds the project in distribution mode.
     */
    gulp.task( 'build:dist', function ( callback ) {

        config.debug = false;
        config.minify = true;

        runSequence(
            'build',
            callback
        );

    } );

}



