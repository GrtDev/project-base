// @formatter:off

var config                      = require('./gulp/config');
var processArguments            = require('./gulp/util/processArguments');

//---------------      S E T T I N G S      ----------------

// You can find all possible settings ( and more information ) in the 'gulp/config.js' file.
// But -- PLEASE CREATE YOUR DEFAULT CONFIGURATION HERE, and NOT in the config file!

config.gulp.debug               = false;

config.debug                    = true;
config.verbose                  = false;
config.notifyErrors             = true;

config.minify                   = false;
config.sourcemaps               = true;
config.cleanCSS                 = false; // removes unused CSS, requires 'gulp-uncss' installation.
config.prettyHTML               = false;


// Assign process arguments.
// To use process arguments add '--[key] [value]' to the command.
// If the value is omitted, the value true will be assigned to the key.
if( processArguments.has( 'verbose' ) )      config.verbose     = processArguments.get( 'verbose' );
if( processArguments.has( 'debug' ) )        config.debug       = processArguments.get( 'debug' );
if( processArguments.has( 'gulp-debug' ) )   config.gulp.debug  = processArguments.get( 'gulp-debug' );


// Register files that need to be copied from the bower components here.
// NOTE:    It is better to use 'require("path_to_file")' for javascript files
//          or to use '@import' in sass so it is compiled into the existing file.
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
            [ 'copyAssets', 'copyBower', 'images', 'svg' ],
            [ 'ejs', 'browserify', 'sass' ],
            callback
        );

    } );


    /**
     * @task build:dist
     * Builds the project in distribution mode and possible pushes the files to the backend folder if needed.
     */
    gulp.task( 'dist', function ( callback ) {

        config.debug            = false;
        config.minify           = true;
        config.sourcemaps       = false;
        config.prettyHTML       = true;

        //var backendPath = '../backend';
        //
        //config.dest.markup      = backendPath + '/html';
        //config.dest.javascript  = backendPath + '/js';
        //config.dest.css         = backendPath + '/css';
        //config.dest.fonts       = backendPath + '/fonts';
        //config.dest.images      = backendPath + '/images';
        //config.dest.svg         = backendPath + '/svg';

        runSequence(
            'build',
            callback
        );

    } );


     /**
     * @task build:bamboo
     * Builds the project for bamboo.
     */
    gulp.task( 'build:bamboo', function ( callback ) {

        config.debug            = false;
        config.throwError       = true;
        config.minify           = true;
        config.sourcemaps       = false;
        config.prettyHTML       = true;

        config.dest.markup      = '<%= root %>/html';

        runSequence(
            'clean',
            [ 'copyAssets', 'copyBower', 'images', 'svg' ],
            [ 'ejs', 'browserify', 'sass' ],
            callback
        );

    } );

}





 //--------------     I N I T     --------------

var startTime               = process.hrtime();
var log                     = require('./gulp/util/log');
var gulp;
var runSequence;

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



