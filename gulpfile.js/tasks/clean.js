// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var config                  = require('../config');
var log                     = require('../util/log');

var gulp                    = requireCachedModule('gulp');
var gulpUtil                = requireCachedModule('gulp-util');
var del                     = requireCachedModule('del');

// @formatter:on

/**
 *  Gulp task for cleaning up the destination folder.
 *  Deletes all files that match the patterns in the option.source
 *  @see: https://www.npmjs.com/package/del
 */
gulp.task( 'clean', function ( callback ) {

    if( !config.cleanBuild ) {

        if( typeof callback === 'function' ) callback.call( this );

        return;

    }


    var options = {

        // define file patterns to delete here
        source: config.dest.getPath( 'root', '**' ),

        // log deleted files
        verbose: config.gulp.verbose

    };


    var deletedFiles;

    try {

        deletedFiles = del.sync( options.source );

    } catch ( error ) {

        log.error( error );

    }


    if( options.verbose && deletedFiles ) {

        var filesDeletedString = '';
        var currentWorkingDirectory = process.cwd();
        for ( var i = 0, leni = deletedFiles.length; i < leni; i++ ) filesDeletedString += '\n\t\t' + deletedFiles[ i ];

        // remove CWD path of the file names.
        filesDeletedString = filesDeletedString.replace( new RegExp( currentWorkingDirectory, 'g' ), '' );

        log.info( {
            sender: 'clean task',
            message: 'Files deleted during cleanup:',
            data: [ gulpUtil.colors.yellow( filesDeletedString ) ]
        } );

    }

    if( callback ) callback.call( this );


} );