// @formatter:off

var gulp                = require('gulp');
var browserifyTask      = require('./browserify');

// @formatter:on


gulp.task('watchify', function() {

    // Start browserify task with watchify === true
    return browserifyTask(true);

});