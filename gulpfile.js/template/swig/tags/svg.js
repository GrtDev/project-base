//@formatter:off

var svgFunction             = require( '../../utils/svg' );

//@formatter:on


// @see: http://paularmstrong.github.io/swig/docs/extending/#tags
var swigTag = {

    ends: false,
    blockLevel: false

};

swigTag.parse = function ( str, line, parser, types, options ) {


    parser.on( types.STRING, function ( token ) {

        this.out.push( token.match.replace( /['|"]/g, '' ) ); // sent the token to the compiler

    } );

    return true; // parser is good to go

};

swigTag.compile = function ( compiler, args, content, parents, options, blockName ) {

    var svgData;

    try {

        svgData = svgFunction( args[ 0 ] );

    } catch ( error ) {

        throw error;

    }

    svgData = svgData.replace( /['|"]/g, '\\"' );
    svgData = svgData.replace( /[\n|\r]/g, '\\n' );

    return '_output += "' + svgData + '";';

};


module.exports = swigTag;