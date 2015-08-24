//@formatter:off

var debugFunction             = require( '../../utils/debug' );

//@formatter:on


module.exports = function ( input ) {

console.log( typeof input);

    return debugFunction( input );

};

module.exports.safe = true;