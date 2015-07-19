/**
 * @author Geert Fokke - geert@sector22.com
 * @www www.sector22.com
 */

// Fix console.log for < IE10
if(!global.console) global.console = {};
if(!global.console.log) global.console.log = function () {};


// Import needed files here
                          require('./src/cookie/cookieNotification');
var ExampleClass        = require('./src/ExampleClass');


console.log("main.js initiated!");


var example1 = new ExampleClass();

example1.test();