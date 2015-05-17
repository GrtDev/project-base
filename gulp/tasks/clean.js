// @formatter:off

var config              = require('../config');
var gulp                = require('gulp');
var gulpUtil            = require('gulp-util');
var del                 = require('del');
var notify              = require("gulp-notify");

// @formatter:on

/**
 *  Gulp task for cleaning up the destination folder.
 *  Deletes all files that match the patterns in the option.source
 *  @see: https://www.npmjs.com/package/del
 */
gulp.task('clean', function () {

    var options = {

        // define file patterns to delete here
        source: [
            config.dest.getPath('markup', '*.html'),
            config.dest.getPath('assets', '**')
            //config.dest.getPath('images',       '**'),
            //config.dest.getPath('javascript',   '**'),
            //config.dest.getPath('css',          '**'),
        ],

        // log deleted files
        verbose: config.verbose

    };

    del(options.source, handleFilesDeleted);

    function handleFilesDeleted(error, deletedFiles) {

        if(error) notify(error);

        if(options.verbose)
        {
            var filesDeletedString = '';
            var currentWorkingDirectory = process.cwd();
            for (var i = 0, leni = deletedFiles.length; i < leni; i++) filesDeletedString += '\n\t\t' + deletedFiles[i];

            // remove CWD path of the file names.
            filesDeletedString = filesDeletedString.replace(new RegExp(currentWorkingDirectory, 'g'), '');

            gulpUtil.log('Files deleted during cleanup:', gulpUtil.colors.yellow(filesDeletedString));
        }

    }


});