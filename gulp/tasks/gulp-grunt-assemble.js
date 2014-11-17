/**
 * Created by gfokke on 13/11/14.
 */

var gulp = require('gulp');

require('gulp-grunt')(gulp, {
    prefix: '',     // we prefix the tasks ourself..
    verbose: false
}); // add all the gruntfile tasks to gulp

// run them like any other task
gulp.task('gulp-grunt-assemble', ['grunt-assemble']);