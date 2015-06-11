//@formatter:off

var log                     = require('./log');
var config                  = require('../config');
var requireCachedModule     = require('./requireCachedModule');

var path                    = require('path');
var glob                    = requireCachedModule('glob');


var dotRegExp               = /^\./;

// @formatter:on

function loadTasks () {

    // pre-load all gulp tasks if we're not loading at runtime
    if( config.gulp.lazy ) return log.info( { sender: 'loadTasks', message: '\tRunning in lazy mode, tasks will be loaded at runtime.' } );

    log.debug( { sender: 'loadTasks', message: '\tLoading tasks...' } );

    var relative = path.relative( __dirname, process.cwd() );
    var taskFiles = glob.sync( './gulp/tasks/**/*.js' );

    for ( var i = 0, leni = taskFiles.length; i < leni; i++ ) {

        require( taskFiles[ i ].replace( dotRegExp, relative ) );

        if( config.gulp.debug ) log.info( { sender: 'loadTasks', message: 'task loaded: ' + taskFiles[ i ] } );

    }

    log.debug( { sender: 'loadTasks', message: '\tDone.' } );

}

module.exports = loadTasks;