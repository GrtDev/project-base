//@formatter:off

var log                     = require('./log');
var config                  = require('../config');

var gulpLoadPlugins         = require('gulp-load-plugins');

// @formatter:on

function loadPlugins ( callback, lazy, opt_global ) {

    opt_global = opt_global || global;

    if( typeof opt_global.plugins !== 'undefined' ) {

        log.error( {
            sender: 'loadPlugins',
            message: 'Attempting to load plugins, but they have already been loaded?!'
        } );

        return;
    }

    this.options = {

        verbose: config.gulp.verbose,

        load: {
            pattern: [ '*' ], // ALL your plugins belong to me!
            scope: [ 'devDependencies' ], // which keys in the config to look within
            replaceString: /\\/, // what to remove from the name of the module when adding it to the context
            camelize: true, // if true, transforms hyphenated plugins names to camel case
            lazy: lazy // whether the plugins should be lazy loaded on demand
        }
    };

    log.info( { sender: 'loadPlugins', message: '\tIndexing plugins...' } );

    var plugins = gulpLoadPlugins( options.load );

    if( options.verbose ) {


        var pluginsLoaded = '';
        for ( var plugin in plugins ) {

            if( !plugins.hasOwnProperty( plugin ) ) continue;
            pluginsLoaded += '\n- ' + plugin;

        }

        log.info( {
            sender: 'loadPlugins',
            message: '\tPlugins loaded at runtime (lazy load: ' + options.load.lazy + '):',
            data: [ pluginsLoaded ]
        } );

    }


    // make globally accessible
    opt_global.plugins = plugins;

    log.info( { sender: 'loadPlugins', message: '\tDone.' } );

    callback();

}

module.exports = loadPlugins;