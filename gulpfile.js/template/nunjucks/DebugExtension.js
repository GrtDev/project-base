// @formatter:off

var debug           = require( '../utils/debug' );
var NO_ARGUMENT     = '__no-argument-supplied__';

// @formatter:on

function DebugExtension () {

    this.tags = [ 'debug' ];

    this.parse = function ( parser, nodes, lexer ) {
        // get the tag token
        var tok = parser.nextToken();

        // parse the args and move after the block end. passing true
        // as the second arg is required if there are no parentheses
        var args = parser.parseSignature( null, true );
        parser.advanceAfterBlockEnd( tok.value );

        // work around for empty arguments bug
        if( args.children.length == 0 ) args.addChild( new nodes.Literal( 0, 0, NO_ARGUMENT ) );

        // See above for notes about CallExtension
        return new nodes.CallExtension( this, 'run', args );
    };

    this.run = function ( context, name ) {

        var value = ( typeof name === 'string' && name !== NO_ARGUMENT ) ? context[ 'ctx' ][ name ] : context[ 'ctx' ];

        return debug( value );

    };
}

module.exports = DebugExtension;