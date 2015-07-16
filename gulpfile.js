// @formatter:off

var config                  = require('./gulp/config');

//---------------      S E T T I N G S      ----------------

// You can find all possible settings in the 'gulp/config.js' file.
// But -- MAKE YOUR CUSTOM CONFIGURATION HERE, and NOT in the config file!

config.debug                    = true;
config.verbose                  = false;
config.notifyErrors             = true;
config.gulp.debug               = false;
config.gulp.lazy                = true;

config.javascript.minify        = false;
config.javascript.sourcemaps    = true;

config.css.minify               = false;
config.css.sourcemaps           = true;
config.css.removeUnused         = false;

config.markup.minify            = true;
config.markup.prettify          = true;



// Register files that need to be copied from the bower components here.
// NOTE:    It is better to use 'require("path_to_file")' for javascript
//          or to use '@import' in sass, as less files means less server requests.
config.bowerDependencies = function () {
    return [
        //{
        //    source: ['jquery/dist/jquery.min.js'],
        //    dest: config.dest.getPath('javascript')
        //},
        //{
        //    source: ['bootstrap/fonts/**'],
        //    dest: config.dest.getPath('fonts', 'bootstrap/')
        //}
    ];
}


//--------------     M A I N   T A S K S    L I S T     --------------

function registerMainTasks(){

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
     *  Deletes the old files and builds the project from scratch.
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
     * @task build:dist
     * Builds the project in distribution mode and possible pushes the files to the backend folder if needed.
     */
    gulp.task( 'dist', function ( callback ) {

        config.debug                    = false;

        config.javascript.minify        = true;
        config.javascript.sourcemaps    = false;

        config.css.minify               = true;
        config.css.sourcemaps           = false;

        config.markup.prettify          = true;

        //var backendPath = '../backend';

        //config.dest.markup      = backendPath + '/html';
        //config.dest.javascript  = backendPath + '/js';
        //config.dest.css         = backendPath + '/css';
        //config.dest.fonts       = backendPath + '/fonts';
        //config.dest.images      = backendPath + '/images';
        //config.dest.svg         = backendPath + '/svg';

        runSequence(
            'build',
            'svgExport',
            callback
        );

    } );


     /**
     * @task build:bamboo
     * Builds the project for bamboo.
     */
    gulp.task( 'build:bamboo', function ( callback ) {

        config.debug        = false;
        config.minify       = true;
        config.throwError   = true;

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

}





 //--------------     I N I T     --------------

var log                     = require('./gulp/util/log');
var gulp;
var runSequence;
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



