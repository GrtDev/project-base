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


// Angular files

// Controllers
require('./angular/controllers/example');

// Directives
require('./angular/directives/example');

// Filters
require('./angular/filters/example');

// Interceptors
require('./angular/interceptors/example');

// Services
require('./angular/services/example');

// Transformers
require('./angular/transformers/example');

// modules
require('./angular/modules/app');
require('./angular/modules/app-config');
require('./angular/modules/app-run');

<% for(i=0;i<angularModules.length;i++) { %>require('<%= angularModules[i] %>')<% } %>