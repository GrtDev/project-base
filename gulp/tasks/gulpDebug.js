// @formatter:off

var gulp                        = require('gulp');
var config                      = require('../config');
var gulpDecorator               = require('../util/gulpDecorator');

// @formatter:on

/**
 * Adds debug logs to all gulp tasks.
 * Has to run before any other task!
 */
gulp.task('gulpDebug', function() {

    if(config.gulpDebug) gulpDecorator.debug(gulp);

    this.emit('end');

});