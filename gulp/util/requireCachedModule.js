//@formatter:off

var log                     = require('./log');
var config                  = require('../config');

var specialCharacterRegExp  = /[^\w-]/g;
var cameCaseRexp            = /-(\w)/g;

// @formatter:on

/**
 * Checks if the required module can be loaded from the cached object,
 * otherwise it will do a normal require.
 * @param module {string}
 */
function requireCachedModule ( module ) {

    if( !module ) return null;

    if( specialCharacterRegExp.test( module ) ) {

        console.log( 'warning: can not require relative modules: ' + module );
        return require( module );

    }

    // check if module is globally available
    var plugins = global.plugins;
    var pluginName = module.replace( cameCaseRexp, camelCaseReplacer );

    // return cached module
    if( plugins && plugins[ pluginName ] ) return plugins[ pluginName ];

    var moduleInstance;

    try {

        moduleInstance = require( module );

    } catch ( error ) {
        
        // assign placeholder function
        moduleInstance = function ( options ) {

            return {
                on: function () {

                    log.error( {
                        sender: 'requireCachedModule',
                        message: 'Missing module: ' + log.colors.yellow(module) + '.\n' +
                        'Please make sure the missing module is installed.\n' +
                        'Run: '+ log.colors.yellow('"npm install ' + module + ' --save-dev"') + ' to install the missing module.'
                    }, null, true );

                }
            };

        }

    }


    return moduleInstance;


}

function camelCaseReplacer ( match, p1 ) {

    return p1 ? p1.toUpperCase() : '';

}


module.exports = requireCachedModule;