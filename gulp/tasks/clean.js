// @formatter:off

var gulp                = require('gulp');
var del                 = require('del');
var config              = require('../config');

// @formatter:on


gulp.task('clean', function () {

    var options = {

        source: [config.dest.getPath('root', '**')],
        verbose: config.verbose

    };

    del(options.source, handleFileDeleted);

    function handleFileDeleted(error, deletedFiles) {
        if(options.verbose)
        {
            console.log('Files deleted:', deletedFiles.join(', '));
        }
    }


});