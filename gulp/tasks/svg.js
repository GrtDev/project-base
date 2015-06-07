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


/**
 * Task for optimizing images (size).
 * @see https://www.npmjs.com/package/gulp-imagemin
 */
gulp.task('svg', function () {

    var options = {

        source: config.source.getPath('svg', '**/*.svg'),
        dest: config.source.getPath('markup', '_data/_export/svg/'),

        config: {
            js2svg: {
                pretty: true // pretty printed svg
            }
        },

        json: config.source.getPath('markup', '_data/_export/svg/svg-filelist.json')

    };


    var fileList = glob.sync(options.source);
    var fileNames = [];
    for (var i = 0, leni = fileList.length; i < leni; i++) {

       fileNames.push( path.basename(fileList[i], '.svg'));

    }

    try {

        jsonFile.writeFileSync(options.json, fileNames);

    } catch ( error ) {

        log.error(error);

    }



    return gulp.src(options.source)

        .pipe(changed(options.dest))        // Ignore unchanged files
        .pipe(svgmin(options.config))       // Optimize
        .pipe(gulp.dest(options.dest))      // Export

});
