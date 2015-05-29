//@formatter:off

var gulp                    = require('gulp');
var runSequence             = require('run-sequence');
var requireDir              = require('require-dir');
var config                  = require('./gulp/config');
var gulpDecorator           = require('./gulp/util/gulpDecorator');

// Decorate gulp with extra functionality for better debugging and error handling.
gulpDecorator(gulp);

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true });



//---------------      B A S I C   S E T T I N G S      ----------------//

// For all the default settings such as file paths and more check the actual 'gulp/config.js' file.

config.debug            = true;
config.minify           = false;
config.gulpDebug        = false;
config.verbose          = false;

// Bower dependencies will be automatically copied to their corresponding build folder destination.
// If possible it is better to use '@import' for scss (instead of css) files or 'require("path_to_file")' for javascript files.
config.bowerDependencies = {

    css: [
        'bootstrap/dist/bootstrap.min.css'
    ],

    javascript: [
        'bootstrap/dist/js/*.js'
    ]

}


//--------------     B A S I C   T A S K S    L I S T     --------------//

// specifies the default set of tasks to run when you run `gulp`.
gulp.task('default', ['server']);


/**
 *  Build the project.
 *  Fires up a local server.
 *  Starts watching all the used files and rebuilds on file changes.
 *  - This will also automatically refresh your browser after something has been rebuild.
 */
gulp.task('server', function() {

    runSequence(
        'build',
        'browserSync',
        'watch'
    );

});

/**
 *  Deletes the olds files and builds the project from scratch.
 */
gulp.task('build', ['gulpDebug'], function() {

    runSequence(
        'clean',
        'images',
        'handlebars',
        'browserify',
        'sass'
    );

});

/**
 *  Deletes the olds files and builds the project from scratch.
 */
gulp.task('build:dist', function() {

    config.debug    = false;
    config.minify   = true;

    runSequence(
        'build'
    );

});

