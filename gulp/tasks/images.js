// @formatter:off

var changed             = require('gulp-changed');
var gulp                = require('gulp');
var imagemin            = require('gulp-imagemin');
var config              = require('../config');
var handleErrors        = require('../util/handleErrors');



/**
 * Task for optimizing images (size).
 * @see https://www.npmjs.com/package/gulp-imagemin
 */
gulp.task('images', function () {

    var options = {

        source: config.source.getPath('images', '**/*.{jpg|jpeg|gif|svg|png}'),
        dest: config.dest.getPath('images'),

        config: {
            optimizationLevel: 3,   // default 3
            progressive: false,     // for JPG, default false
            interlaces: false,      // for GIF, default false
            multipass: false        // for SVG,  default false
        }

    };

    //@formatter:on

    return gulp.src(options.source)
        .on('error', handleErrors)
        .pipe(changed(options.dest))        // Ignore unchanged files
        .pipe(imagemin())                   // Optimize
        .pipe(gulp.dest(options.dest));     // Export
});
