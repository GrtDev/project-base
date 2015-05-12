// @formatter:off

var changed    = require('gulp-changed');
var gulp       = require('gulp');
var imagemin   = require('gulp-imagemin');
var config     = require('../config');

//@formatter:on

gulp.task('images', function () {

    var options = {
        source: config.source.getPath('images', '**'),
        dest: config.dest.getPath('images')
    };


    return gulp.source(options.source)
        .pipe(changed(options.dest))        // Ignore unchanged files
        .pipe(imagemin())                   // Optimize
        .pipe(gulp.dest(options.dest));     // Export
});
