//@formatter:off

var log                     = require('./log');
var config                  = require('../config');

var specialCharacterRegExp  = /[^\w-]/g;
var cameCaseRexp            = /-(\w)/g;

/**
 * Checks if the required module can be loaded from the cached object,
 * otherwise it will do a normal require.
 * @param module {string}
 */
function requireCachedModule(module) {

    if(!module) return null;

    if(specialCharacterRegExp.test(module)) {

        console.log('warning: can not require relative modules: ' + module );
        return require(module);

    }

    // check if module is globally available
    var plugins = global.plugins;
    var pluginName = module.replace(cameCaseRexp, camelCaseReplacer);

    // no cached module available
    if(!plugins || !plugins[pluginName]) return require(module);

    return plugins[pluginName];

}

function camelCaseReplacer(match, p1){

    return p1 ? p1.toUpperCase() : '';

}


module.exports = requireCachedModule;
