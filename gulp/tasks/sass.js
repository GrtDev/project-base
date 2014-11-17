// @formatter:off

var gulp            = require('gulp');
var sass            = require('gulp-ruby-sass');
var handleErrors    = require('../util/handleErrors');
var config          = require('../config').sass;

gulp.task('sass', function () {

  return gulp.src(config.src)
    .pipe(sass({
            compass:        true,     // Make Compass imports available and load project configuration (config.rb located close to the gulpfile.js).
          relativeAssets: true,
            bundleExec:     true,
            cacheLocation:  config.cache,
            noCache: true,
          trace: true,
          debugInfo:true
    }))
    .on('error', handleErrors)
    .pipe(gulp.dest(config.dest));

});

// @formatter:on
