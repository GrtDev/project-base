//@formatter:off

var debugFunction             = require( '../../utils/debug' );

//@formatter:on


// @see: http://paularmstrong.github.io/swig/docs/extending/#tags
var swigTag = {

    ends: false,
    blockLevel: false

};

swigTag.parse = function ( str, line, parser, types, options ) {


    parser.on( types.VAR, function ( token ) {

        this.out.push( token.match ); // sent the token to the compiler

    } );

    return true; // parser is good to go

};

swigTag.compile = function ( compiler, args, content, parents, options, blockName ) {

    var data = '_ctx';

    if( args.length && args[ 0 ] !== 'this' ) {

        data += '.' + args[ 0 ];

    }

    var code = '';
    code += 'if(typeof _filters.debug === "function") {';
    code += '    _output += _filters.debug(' + data + ');';
    code += '} else {';
    code += '    _output += "[ Error: Failed to retrieve the \'debug\' filter. ]"';
    code += '}';
    return code;

};


module.exports = swigTag;