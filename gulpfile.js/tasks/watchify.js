// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var browserifyTask          = require('./browserify');

var gulp                    = requireCachedModule('gulp');

// @formatter:on


gulp.task('watchify', function() {

    // Start browserify task with watchify === true
    return browserifyTask(true);

});