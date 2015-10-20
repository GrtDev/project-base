// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var config                  = require('../config');
var log                     = require('../util/log');

var gulp                    = requireCachedModule('gulp');
var gulpZip                 = requireCachedModule('gulp-zip');


// @formatter:on


gulp.task('zip', function () {

    var options = {

            fileName: config.name + '-' +  config.version + '.zip',
            source:config.dest.getPath('root', '**'),
            dest:config.dest.getPath('root')

    };

    return gulp.src(options.source)
        .pipe(gulpZip(options.fileName))
        .pipe(gulp.dest(options.dest));
});