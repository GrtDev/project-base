// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var config                  = require('../config');
var path                    = require('path');

var gulp                    = requireCachedModule('gulp');
var gulpIf                  = requireCachedModule('gulp-if');
var gulpConcat              = requireCachedModule('gulp-concat');
var uglify                  = requireCachedModule('gulp-uglify');
var sourcemaps              = requireCachedModule('gulp-sourcemaps');

// @formatter:on

/**
 * Task for optimizing images (size).
 * @see https://www.npmjs.com/package/gulp-imagemin
 */
gulp.task('concat', function () {

    var options = {

        uglifyOptions: {
            mangle: true,               // Pass false to skip mangling names.
            preserveComments: false     // 'all', 'some', {function}
        }

    };

    var libs = (typeof config.javascriptLibs === 'function') ? config.javascriptLibs() : null;

    if(!libs || !libs.length) return null;

    return gulp.src( libs )

        .pipe( gulpIf( config.sourcemaps, sourcemaps.init( ) ) )
        .pipe( gulpConcat('libs.js') )
        .pipe( gulpIf( config.minify, uglify( options.uglifyOptions ) ) )
        .pipe( gulpIf( config.sourcemaps, sourcemaps.write( path.relative( config.dest.getPath( 'javascript' ), config.dest.getPath( 'sourcemaps' ) ) ) ) )
        .pipe( gulp.dest( config.dest.getPath( 'javascript' ) ) );                  // Export

} );
