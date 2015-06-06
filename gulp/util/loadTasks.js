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
    if( config.gulp.lazy ) return log.debug( { sender: 'util/loadTasks', message: '\tRunning in lazy mode, tasks will be loaded at runtime...' } );

    log.debug( { sender: 'util/loadTasks', message: '\tLoading tasks...' } );

    var globPattern = './gulp/tasks/**/*.js';
    var relative = path.relative( __dirname, process.cwd() );
    var taskFiles = glob.sync( globPattern );

    for ( var i = 0, leni = taskFiles.length; i < leni; i++ ) {

        require( taskFiles[ i ].replace( dotRegExp, relative ) );

        if( config.verbose ) log.debug( { sender: 'util/loadTasks', message: 'task loaded: ' + taskFiles[ i ] } );

    }

    log.debug( { sender: 'util/loadTasks', message: '\tDone.' } );

}

module.exports = loadTasks;