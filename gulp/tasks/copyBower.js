// @formatter:off

var config                  = require('../config');
var log                     = require('../util/log');

var gulp                    = require('gulp');
var changed                 = require('gulp-changed');
var mergeStream             = require('merge-stream');

// @formatter:on

/**
 *  Gulp task for copying Bower assets to the destination folder.
 *  @see: https://www.npmjs.com/package/del
 */
gulp.task('copyBower', function () {


    var options = config.bowerDependencies && typeof config.bowerDependencies === 'function' ? config.bowerDependencies() : null;
    var streams = [];

    if(!options || !options.length) return null;

    var bowerComponentsPath = config.source.getPath('bower');


    if(!bowerComponentsPath)
    {
        log.error({
            message: 'Failed to find the source location of the bower components. Please define a \'bower\' path in the config.source .',
            plugin: 'copyBower'
        });
        return null;
    }


    for (var i = 0, leni = options.length; i < leni; i++)
    {
        var source = options[i].source;
        var dest = options[i].dest;

        if(!source)
        {
            log.error({
                message: 'Bower dependency needs to have a \'source\' property!',
                plugin: 'copyBower'
            });
            continue;
        }

        if(!dest)
        {
            log.error({
                message: 'Bower dependency needs to have a \'dest\' property!',
                plugin: 'copyBower'
            });
            continue;
        }

        streams.push(
            gulp.src(source)
                // Ignore unchanged files
                .pipe(changed(dest))
                // Push the files straight to their destination
                .pipe(gulp.dest(dest))
        );

    }


    return mergeStream(streams);

});