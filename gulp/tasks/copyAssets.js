// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var config                  = require('../config');
var log                     = require('../util/log');

var gulp                    = requireCachedModule('gulp');
var changed                 = requireCachedModule('gulp-changed');

// @formatter:on

/**
 *  Gulp task for copying assets to the destination folder.
 *  Removes all the files from the stream that are defined in the ignore option.
 *  @see: https://www.npmjs.com/package/del
 */
gulp.task('copyAssets', function () {


    var options = {

        // log copied files ?
        source: [
            config.source.getPath('assets', '!(' + config.ignorePrefix + ')*'),
            config.source.getPath('assets', '!(' + config.ignorePrefix + ')/**/!(' + config.ignorePrefix + ')*')
        ],
        // remove these files from the stream
        ignore: [
            config.source.getPath('images'),        // images are copied to the assets via the 'images' task.
            config.source.getPath('images', '**'),  // need a separate ignore for both the folder and all its files.
            config.source.getPath('svg'),
            config.source.getPath('svg', '**')
        ],
        dest: config.dest.getPath('assets')

    };

    // Prefix ignore match
    for (var i = 0, leni = options.ignore.length; i < leni; i++) options.ignore[i] = '!' + options.ignore[i];


    return gulp.src(options.source.concat(options.ignore))

        .pipe(changed(options.dest))        // Ignore unchanged files
        // Push the files straight to their destination
        .pipe(gulp.dest(options.dest));     // Export


});