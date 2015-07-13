// @formatter:off
var config                  = require('./gulp/config');
var log                     = require('./gulp/util/log');
var gulp, runSequence;

//---------------      B A S I C   S E T T I N G S      ----------------

// For ALL the default settings such as folder structure, bower dependencies and more check the actual 'gulp/config.js' file.

config.debug                = true;
config.minify               = false;
config.verbose              = false;
config.notifyErrors         = true;
config.gulp.debug           = false;
config.gulp.lazy            = true;



//--------------     M A I N   T A S K S    L I S T     --------------

function registerMainTasks(){

    // Specifies the default set of tasks to run when you run `gulp`.
    gulp.task( 'default', [ 'server' ] );

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
            'svgOptimize',
            'handlebars',
            'browserify',
            'sass',
            callback
        );

    } );


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
     * @task build:dist
     * Builds the project in distribution mode.
     */
    gulp.task( 'dist', function ( callback ) {

        config.debug    = false;
        config.minify   = true;

        //var backendPath = '../Backend/.../';

        //config.dest.markup      = backendPath + 'html';
        //config.dest.javascript  = backendPath + 'js';
        //config.dest.css         = backendPath + 'css';

        runSequence(
            'build',
            'svgExport',
            callback
        );

    } );

}





 //--------------     I N I T     --------------

var startTime = process.hrtime();
// Load / Index all the plugins for faster task loading.
require('./gulp/util/loadPlugins')(prepare, true, global);

function prepare() {

    require('./gulp/util/loadTasks')(); // load tasks

    var requireCachedModule = require('./gulp/util/requireCachedModule');
    var gulpDecorator       = require('./gulp/util/gulpDecorator');

    gulp                    = requireCachedModule('gulp');
    runSequence             = requireCachedModule('run-sequence');

    gulpDecorator.decorate(gulp); // Decorate gulp with extra functionality for better debugging and error handling.

    log.time( { sender: 'gulpfile', message: 'init - ', time: process.hrtime( startTime ) } );


    registerMainTasks();

}



