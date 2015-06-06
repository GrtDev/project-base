// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var config                  = require('../config');

var changed                 = requireCachedModule('gulp-changed');
var gulp                    = requireCachedModule('gulp');
var imagemin                = requireCachedModule('gulp-imagemin');


/**
 * Task for optimizing images (size).
 * @see https://www.npmjs.com/package/gulp-imagemin
 */
gulp.task('images', function () {

    var options = {

        source: config.source.getPath('images', '**/*(*.jpg|*.jpeg|*.gif|*.svg|*.png)'),
        dest: config.dest.getPath('images'),

        config: {
            optimizationLevel: 3,   // default 3
            progressive: false,     // for JPG, default false
            interlaces: false,      // for GIF, default false
            multipass: false        // for SVG, default false
        }

    };

    return gulp.src(options.source)

        .pipe(changed(options.dest))        // Ignore unchanged files
        .pipe(imagemin())                   // Optimize
        .pipe(gulp.dest(options.dest));     // Export

});
