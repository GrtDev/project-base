/*
  gulpfile.js
  ===========
  Rather than manage one giant configuration file responsible
  for creating multiple tasks, each task has been broken out into
  its own file in gulp/tasks. Any files in that directory get
  automatically required below.

  To add a new task, simply add a new task file that directory.
  gulp/tasks/default.js
*/

var gulp = require('gulp');
var requireDir = require('require-dir');
var runSequence = require('run-sequence');

// Require all tasks in gulp/tasks, including subfolders.
requireDir('./gulp/tasks', { recurse: false });



//--------------     T A S K    L I S T S     --------------//

// specifies the default set of tasks to run when you run `gulp`.
gulp.task('default', ['watch'])

//gulp.task('build', ['browserify', 'sass', 'images', 'markup']);
gulp.task('build', ['browserify', 'markup']);

gulp.task('assemble', function(callback) {
  runSequence('gulp-grunt-assemble', 'prettify', callback);
});
