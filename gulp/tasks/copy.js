// @formatter:off

var config              = require('../config');
var log                 = require('../util/log');

var gulp                = require('gulp');
var gulpUtil            = require('gulp-util');

// @formatter:on

/**
 *  Gulp task for cleaning up the destination folder.
 *  Deletes all files that match the patterns in the option.source
 *  @see: https://www.npmjs.com/package/del
 */
gulp.task('copy', function () {


    var options = {

        // log copied files ?
        verbose: config.verbose

    };


    // TODO


});