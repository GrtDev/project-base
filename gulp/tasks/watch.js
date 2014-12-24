/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp    = require('gulp');
var config  = require('../config');

// runs setWatch & browserSync before executing the task.
gulp.task('watch', ['setWatch', 'browserSync'], function() {
  gulp.watch(config.sass.source,   ['sass']);
  gulp.watch(config.images.src, ['images']);
  gulp.watch(config.handlebars.source, ['handlebars']);
});
