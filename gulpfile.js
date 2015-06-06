// @formatter:off
var startTime               = process.hrtime();
var config                  = require('./gulp/config');

//---------------      B A S I C   S E T T I N G S      ----------------

// For ALL the default settings such as folder structure, bower dependencies and more check the actual 'gulp/config.js' file.

config.debug                = true;
config.minify               = false;
config.verbose              = true;
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
    var prettyHrtime        = requireCachedModule('pretty-hrtime');
    var gulpUtil            = requireCachedModule('gulp-util');

    // Decorate gulp with extra functionality for better debugging and error handling.
    gulpDecorator(gulp);


    console.log( gulpUtil.colors.blue('[gulpfile]\tinit time: ') + gulpUtil.colors.cyan(prettyHrtime( process.hrtime( startTime ) )) );



    //--------------     M A I N   T A S K S    L I S T     --------------//

    // Specifies the default set of tasks to run when you run `gulp`.
    gulp.task( 'default', [ 'server' ] );


    /**
     *  Build the project.
     *  Fires up a local server.
     *  Starts watching all the used files and rebuilds on file changes.
     *  - This will also automatically refresh your browser after something has been rebuild.
     */
    gulp.task( 'server', function ( callback ) {

        if(checkDebugMode()) return;

        runSequence(
            'build',
            'browserSync',
            'watch',
            callback
        );

    } );


    // Deletes the olds files and builds the project from scratch.
    gulp.task( 'build', function ( callback ) {

        if(checkDebugMode()) return;

        runSequence(
            'clean',
            'copyAssets',
            'copyBower',
            'images',
            'handlebars',
            'browserify',
            'sass',
            callback
        );

    } );


    // Deletes the olds files and builds the project from scratch.
    gulp.task( 'build:dist', function ( callback ) {

        if(checkDebugMode()) return;

        config.debug = false;
        config.minify = true;

        runSequence(
            'build',
            callback
        );

    } );

    /**
     * At the moment runSequence does not work well when task functions are decorated with error catching..
     * So when you are debugging gulp, you will have to run the tasks one by one.
     * @returns {boolean}
     */
    function checkDebugMode() {

        if(config.gulp.debug) {
            log.error({message:'Can\'t run sequenced tasks in gulp debug mode.', sender:'gulpfile.js'})
            return true;
        }

        return false;

    }


}



