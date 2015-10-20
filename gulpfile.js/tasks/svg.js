// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var config                  = require('../config');
var log                     = require('../util/log');

var path                    = require('path');
var changed                 = requireCachedModule('gulp-changed');
var gulp                    = requireCachedModule('gulp');
var svgmin                  = requireCachedModule('gulp-svgmin');
var glob                    = requireCachedModule('glob');
var mkdirp                  = requireCachedModule('mkdirp');

// @formatter:on


/**
 * Task for optimizing svg images and making them available in the markup.
 * @see https://www.npmjs.com/package/gulp-svgmin
 */
gulp.task( 'svg', function () {

    var options = {

        svgmin: {
            js2svg: {
                pretty: false // pretty printed svg
            },
            plugins: [
                { removeTitle: true },
                { removeComments: true }
            ]
        }

    };


    return gulp.src( config.source.getFiles( 'svg' ) )

        .pipe( changed( config.dest.getPath( 'svg' ) ) )        // Ignore unchanged files
        .pipe( svgmin( options.svgmin ) )                       // Optimize
        .pipe( gulp.dest( config.dest.getPath( 'svg' ) ) )      // Export

} );
