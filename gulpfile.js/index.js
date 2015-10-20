// @formatter:off

var config                      = require('./config');
var processArguments            = require('./util/processArguments');

//---------------      B A S I C    S E T T I N G S      ----------------

config.gulp.debug               = false;

config.debug                    = true;
config.sourcemaps               = true;
config.notifyErrors             = true;
config.minify                   = false;
config.prettyHTML               = true;
config.cleanCSS                 = false; // removes unused CSS, requires 'gulp-uncss' installation.



// Define asset files here that need to be copied straight to the build folder.
// SVG and image files will be optimized and pushed to the build folder automatically, do not define those here.
config.copy = function () {

    return [
        {   source: config.source.getPath('assets', '*.*'),                                 dest: config.dest.getPath('assets')  },
        {   source: config.source.getPath('assets', 'fonts/**'),                            dest: config.dest.getPath('fonts')  }
    ];

}

// Libraries that will be concatenated together. Prevents 'require' problems from poorly implemented CommonJS style modules.
config.libs = function () {

    return [
        //config.source.getPath('bower', 'jquery/dist/jquery.js' ),
        //config.source.getPath('bower', 'jquery.cookie/jquery.cookie.js' ),
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

        if(config.debug) config.optimizeImages = false;

        runSequence(
            'clean',
            [ 'copy', 'images', 'svg' ],
            [ 'html', 'libs', 'browserify', 'sass' ],
            callback
        );

    } );


    /**
     * @task build:dist
     * Builds the project in distribution mode pushes the files to the backend folder
     */
    gulp.task( 'dist', function ( callback ) {

        config.debug            = false;
        config.minify           = true;
        config.sourcemaps       = false;
        config.prettyHTML       = true;

        var backendPath         = '../backend';
        config.dest.root.path   = backendPath;

        runSequence(
            'build',
            callback
        );

    } );


     /**
     * @task build:bamboo
     * Builds the project for bamboo.
     */
    gulp.task( 'bamboo', function ( callback ) {

        config.debug                = false;
        config.sourcemaps           = false;
        config.throwError           = true;
        config.minify               = true;
        config.prettyHTML           = true;

        config.dest.markup.path     = '<%= root %>/html';

        runSequence(
            'clean',
            [ 'copy', 'images', 'svg' ],
            [ 'html', 'libs', 'browserify', 'sass' ],
            callback
        );

    } );

}





//--------------     I N I T     --------------

// initialization code, no need to touch this.

var startTime               = process.hrtime();
var log                     = require('./util/log');
var gulp;
var runSequence;


// Assign process arguments.
// To use process arguments add '--[key] [value]' to the command.
// If the value is omitted, the value true will be assigned to the key.
if( processArguments.has( 'clean' ) )        config.cleanBuild  = processArguments.get( 'clean' );
if( processArguments.has( 'verbose' ) )      config.verbose     = processArguments.get( 'verbose' );
if( processArguments.has( 'debug' ) )        config.gulp.debug  = processArguments.get( 'debug' );

// Load / Index all the plugins for faster task loading.
require('./util/loadPlugins')(init, true, global);

function init() {

    require('./util/loadTasks')(); // loads all tasks ( if lazy loading is turned off ).

    var requireCachedModule = require('./util/requireCachedModule');
    var gulpDecorator       = require('./util/gulpDecorator');

    gulp                    = requireCachedModule('gulp');
    runSequence             = requireCachedModule('run-sequence');

    gulpDecorator.decorate(gulp); // Decorate gulp with extra functionality for better debugging and error handling.

    log.time( { sender: 'gulpfile', message: 'init - ', time: process.hrtime( startTime ) } );

    registerMainTasks();

}



