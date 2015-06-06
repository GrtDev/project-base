//@formatter:off

var log                     = require('./log');
var config                  = require('../config');
var gulpUtil                = require('gulp-util');
//var requireCachedModule     = require('./requireCachedModule');

var gulpLoadPlugins         = require('gulp-load-plugins');

// @formatter:on

function loadPlugins (callback, lazy, opt_global) {

    opt_global = opt_global || global;

    if( typeof opt_global.plugins !== 'undefined' ) {

        log.error( {
            message: 'Attempting to load plugins, but they have already been loaded?!',
            sender: 'util/loadPlugins'
        } );

        return;
    }

    this.options = {

        verbose: config.verbose,

        load: {
            pattern: [ '*' ], // ALL your plugins belong to me!
            scope: [ 'devDependencies' ], // which keys in the config to look within
            replaceString: /\\/, // what to remove from the name of the module when adding it to the context
            camelize: true, // if true, transforms hyphenated plugins names to camel case
            lazy: lazy // whether the plugins should be lazy loaded on demand
        }
    };

    console.log(gulpUtil.colors.blue('[loadPlugins]\tIndexing plugins...'));

    var plugins = gulpLoadPlugins( options.load );

    if( options.verbose ) {



        var message = gulpUtil.colors.magenta( 'Plugins loaded at runtime (lazy load: ' + options.load.lazy + '):' );

        for ( var plugin in plugins ) {

            if( !plugins.hasOwnProperty( plugin ) ) continue;
            message += gulpUtil.colors.green( '\n- ' + plugin );

        }

        console.log(  message );

    }


    // make globally accessible
    opt_global.plugins = plugins;

    console.log(gulpUtil.colors.blue('[loadPlugins]\tDone.'));

    callback();

}

module.exports = loadPlugins;