//@formatter:off

var gulp                = require('gulp');
var runSequence         = require('run-sequence');
var requireDir          = require('require-dir');
var config              = require('./gulp/config');

//@formatter:on

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true });



//--------------     B A S I C   T A S K    L I S T S     --------------//

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
 *  Builds the entire project from scratch.
 */
gulp.task('build', ['images', 'handlebars', 'sass', 'browserify']);


