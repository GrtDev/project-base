/**
 * @author  Geert Fokke
 * @mail    geert@tamtam.nl
 * @www     www.tamtam.nl
 */

// Fix console.log for < IE10
function consolePolyfill ( global ) {

    if( !global.console )     global.console = {};
    if( !global.console.log ) global.console.log = function () {};

}


var polyfillApplied;
var polyfill = {}

/**
 * Applies basic polyfill to add basic cross-browser functionality
 * Aims to support IE9+
 * @function apply
 * @param opt_global {object=}
 */
polyfill.apply = function ( opt_global ) {

    if( polyfillApplied ) return;
    polyfillApplied = true;

    opt_global = opt_global || global || window;
    consolePolyfill( opt_global );

}

module.exports = polyfill;