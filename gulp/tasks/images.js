// @formatter:off

var changed             = require('gulp-changed');
var gulp                = require('gulp');
var imagemin            = require('gulp-imagemin');
var config              = require('../config');
var handleErrors        = require('../util/handleErrors');

//@formatter:on

gulp.task('images', function () {

    var options = {
        source: config.source.getPath('images', '**/*.{jpg|jpeg|png|bmp|gif}'),
        dest: config.dest.getPath('images')
    };


    return gulp.src(options.source)
        .on('error', handleErrors)
        .pipe(changed(options.dest))        // Ignore unchanged files
        .pipe(imagemin())                   // Optimize
        .pipe(gulp.dest(options.dest));     // Export
});
