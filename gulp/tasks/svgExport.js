// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var config                  = require('../config');

var gulp                    = requireCachedModule('gulp');

// @formatter:on

/**
 * Task for transporting the optimized svg images to a folder where BE can use them.
 * @see https://www.npmjs.com/package/gulp-svgmin
 */
gulp.task( 'svgExport', function () {

    var options = {

        source: config.source.getPath( 'svgOptimized', '**/*.svg' ),
        dest: config.dest.getPath( 'svg' )

    };

    return gulp.src( options.source )

        .pipe( gulp.dest( options.dest ) )      // Export

} );
