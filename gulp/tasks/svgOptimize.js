// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var config                  = require('../config');
var log                     = require('../util/log');

var path                    = require('path');
var changed                 = requireCachedModule('gulp-changed');
var gulp                    = requireCachedModule('gulp');
var svgmin                  = requireCachedModule('gulp-svgmin');
var glob                    = requireCachedModule('glob');
var jsonFile                = requireCachedModule('jsonfile');
var mkdirp                  = requireCachedModule('mkdirp');

// @formatter:on

/**
 * Task for optimizing svg images and making them available in the markup.
 * @see https://www.npmjs.com/package/gulp-svgmin
 */
gulp.task( 'svgOptimize', function () {

    var options = {

        source: config.source.getPath( 'svg', '**/*.svg' ),
        dest: config.source.getPath( 'svgOptimized' ),

        config: {
            js2svg: {
                pretty: false // pretty printed svg
            },
            plugins: [
                { removeTitle: true },
                { removeComments: true }
            ]
        },

        json: {
            dest: config.source.getPath( 'svgOptimized' ),
            fileName: 'svg-filelist.json'
        }

    };

    // retrieve svg name list
    // this is used to create the overview in the styleguide
    var svgSourcePath = config.source.getPath( 'svg' );
    var fileList = glob.sync( options.source );
    var fileNames = [];
    for ( var i = 0, leni = fileList.length; i < leni; i++ ) {

        var svgName = fileList[ i ];
        svgName = svgName.replace(svgSourcePath, '');
        svgName = svgName.replace(/\.svg$/, '');
        svgName = svgName.replace(/^\//, '');
        fileNames.push( svgName );

    }

    try {

        // Make sure the directory exists
        mkdirp.sync( options.json.dest );
        jsonFile.writeFileSync( options.json.dest + '/' + options.json.fileName, fileNames );

    } catch ( error ) {

        log.error( error );

    }


    return gulp.src( options.source )

        .pipe( changed( options.dest ) )        // Ignore unchanged files
        .pipe( svgmin( options.config ) )       // Optimize
        .pipe( gulp.dest( options.dest ) )      // Export

} );
