// @formatter:off

var gulp                    = require('gulp');
var config                  = require('../config');
var browserSync             = require('browser-sync');



gulp.task('watch', ['watchify'], function (callback) {

    gulp.watch(config.source.getPath('css',     '**/*.scss'),   ['sass']);
    gulp.watch(config.source.getPath('markup',  '**/*.hbs'),    ['handlebars']);

});

// @formatter:on