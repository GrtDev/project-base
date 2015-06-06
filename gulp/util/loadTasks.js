//@formatter:off

var log                     = require('./log');
var config                  = require('../config');
var requireCachedModule     = require('./requireCachedModule');

var path                    = require('path');
var glob                    = requireCachedModule('glob');
var gulpUtil                = requireCachedModule('gulp-util');


var dotRegExp               = /^\./;

// @formatter:on

function loadTasks () {

    // pre-load all gulp tasks if we're not loading at runtime
    if( config.gulp.lazy ) {

        console.log( gulpUtil.colors.blue( '[loadTasks]\tRunning in lazy mode, tasks will be loaded at runtime...' ) );

        return;
    }

    console.log( gulpUtil.colors.blue( '[loadTasks]\tLoading tasks...' ) );

    var globPattern = './gulp/tasks/**/*.js';
    var relative = path.relative( __dirname, process.cwd() );
    var taskFiles = glob.sync( globPattern );

    for ( var i = 0, leni = taskFiles.length; i < leni; i++ ) {

        require( taskFiles[ i ].replace( dotRegExp, relative ) );

        if( config.verbose ) console.log( 'task loaded: ' + taskFiles[ i ] );

    }

    console.log( gulpUtil.colors.blue( '[loadTasks]\tDone.' ) );

}

module.exports = loadTasks;