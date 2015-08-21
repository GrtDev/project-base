/**
 * @author  Geert Fokke
 * @mail    geert@tamtam.nl
 * @www     www.tamtam.nl
 */

// @formatter:off

// Import needed files here
                              require('./src/polyfill/polyfill' ).apply();
var cookieNotification      = require('./src/cookie/cookieNotification');
var ExampleClass            = require('./src/ExampleClass');


// @formatter:on


console.log( 'main.js initiated!' );

cookieNotification.check();


var example1 = new ExampleClass();
var example2 = new ExampleClass( 'custom message' );

example1.test();
example2.test();