/**
 * @author Geert Fokke - geert@sector22.com
 * @www www.sector22.com
 */


var notGlobal = 'This variable is not global because this file is wrapped into its own scope by browserify.';

/**
 * Small example on how to define a 'class' like object.
 * @constructor
 */
function ExampleClass() {

    var message = 'Woohoo!'

    this.test = function () {

        console.log(message);

    }

}


// Assign the value any other file will receive when they 'require' this file.
module.exports = ExampleClass;