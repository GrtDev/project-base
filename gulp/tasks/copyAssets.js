// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var config                  = require('../config');
var log                     = require('../util/log');

var gulp                    = requireCachedModule('gulp');
var changed                 = requireCachedModule('gulp-changed');
var mergeStream             = requireCachedModule('merge-stream');

// @formatter:on

/**
 *  Gulp task for copying Bower assets to the destination folder.
 *  @see: https://www.npmjs.com/package/del
 */
gulp.task('copyAssets', function () {


    var files = config.assets && typeof config.assets === 'function' ? config.assets() : null;
    var streams = [];

    if(!files || !files.length) return null;


    for (var i = 0, leni = files.length; i < leni; i++)
    {
        var source = files[i].source;
        var dest = files[i].dest;

        if(!source)
        {
            log.error({
                message: 'assets config needs to have a \'source\' property!',
                sender: 'copyAssets'
            });
            continue;
        }

        if(!dest)
        {
            log.error({
                message: 'assets config needs to have a \'dest\' property!',
                sender: 'copyAssets'
            });
            continue;
        }

        streams.push(
            gulp.src(source)

                .pipe(changed(dest))            // Ignore unchanged files
                .pipe(gulp.dest(dest))          // Push the files straight to their destination
        );

    }


    return mergeStream(streams);

});