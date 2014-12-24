// @formatter:off

var changed    = require('gulp-changed');
var gulp       = require('gulp');
var imagemin   = require('gulp-imagemin');
var config     = require('../config').images;

gulp.task('images', function() {

  return gulp.source(config.source)
    .pipe(changed(config.dest))     // Ignore unchanged files
    .pipe(imagemin())               // Optimize
    .pipe(gulp.dest(config.dest));  // Export

});

// @formatter:on
