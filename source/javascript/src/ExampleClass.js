/**
 * @author  Geert Fokke
 * @mail    geert@tamtam.nl
 * @www     www.tamtam.nl
 */

// Note that this variable will be only accessible within this file
// and that it's value will remain the same for all ExampleClass instances created.
var notGlobal = 'This variable is not global because this file is wrapped into its own scope by browserify.';


/**
 * Small example on how to define a 'class' like object.
 * @constructor
 * @param opt_message {string=} an optional message
 */
function ExampleClass ( opt_message ) {

    // a public variable, can be changed upon any instance of this class.
    this.something = 42;

    // a private variable, ONLY accessible from within this class.
    var _message = opt_message || 'Woohoo!'


    // a public function, can be called upon any instance of this class.
    this.test = function () {

        console.log( lowercase( _message ) );

    }

    // a private function, can ONLY be called from within this class.
    function lowercase ( string ) {

        return string.toLocaleLowerCase();

    }

}


/**
 * Assign the value any other file will receive when they 'require' this file.
 * In this case the constructor of this ExampleClass
 * This way other files can create new instances of this class using the 'new' keyword:
 * e.g.:
 *      var someInstance = new ExampleClass( 'custom message' );
 */
module.exports = ExampleClass;