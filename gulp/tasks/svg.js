// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var config                  = require('../config');
var log                     = require('../util/log');
var svgFileList             = require('../template/swig/partials/svgFileList');

var fileSystem              = require('fs');
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

        source: config.source.getPath( 'svg', '**/*.svg' ),
        dest: config.dest.getPath( 'svg' ),

        config: {
            js2svg: {
                pretty: false // pretty printed svg
            },
            plugins: [
                { removeTitle: true },
                { removeComments: true }
            ]
        },

        svgListPartial:{
            dest: config.source.getPath( 'markupPartials', 'debug'),
            fileName: 'svgList.swig'
        }

    };


    // Creates a SVG list partial for all the svg files, used in the styleguide
    var svgListPartial = svgFileList.create( options.source, config.source.getPath( 'svg' ) );

    try {

        // Make sure the directory exists
        mkdirp.sync( options.svgListPartial.dest );
        fileSystem.writeFileSync( options.svgListPartial.dest + path.sep + options.svgListPartial.fileName, svgListPartial );

    } catch ( error ) {

        log.error( error );

    }

    return gulp.src( options.source )

        .pipe( changed( options.dest ) )        // Ignore unchanged files
        .pipe( svgmin( options.config ) )       // Optimize
        .pipe( gulp.dest( options.dest ) )      // Export

} );
