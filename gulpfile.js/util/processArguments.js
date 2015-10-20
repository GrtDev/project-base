//@formatter:off

var log                     = require('./log');

//@formatter:on

var argumentKeyRegExp = /^--/i;
var processArguments = getArguments();

function getArguments () {

    var processArguments = process.argv;
    var parsedArguments = {};

    for ( var i = 0, iLength = processArguments.length; i < iLength; i++ ) {

        var processArgument = processArguments[ i ];

        // check if the argument is a key ( starts with '--' )
        if( argumentKeyRegExp.test( processArgument ) ) {

            var key = processArgument.replace( argumentKeyRegExp, '' );
            var value = processArguments[ i + 1 ];

            // Keys that have no value get the value true
            // ( The next argument is undefined or is a key itself )
            if( value === undefined || argumentKeyRegExp.test( value ) ) {

                value = true;

            }
            else {

                // if there was a value for this key, skip the value index
                i++;

            }

            if( parsedArguments[ key ] !== undefined ) log.warn( {
                sender: 'processArguments',
                message: 'Duplicate process argument: ' + key + ', previous value will be overwritten!'
            } );

            // add argument to arguments object
            parsedArguments[ key ] = value;

        }
    }

    return parsedArguments;
}



function dump () {

    var message = log.colors.cyan( 'Process Arguments Dump:' );
    var indent;

    for ( var key in processArguments ) {
        if( !processArguments.hasOwnProperty( key ) ) continue;
        var value = processArguments[ key ];

        message += '\n\t' + log.colors.cyan( key ) + ':';

        // get proper indentation
        indent = Math.floor( key.length / 8 );
        while ( indent < 2 ) {
            message += '\t';
            indent++;
        }

        if( typeof value === 'string' ) {

            message += log.colors.white( '\"' + value + '\"' );

        } else {

            message += log.colors.white( value );

        }

    }

    log.info( { sender: 'processArguments', message: message } );

}


function hasArgument ( key ) {

    return processArguments[ key ] !== undefined;

}

function getArgument ( key ) {

    return processArguments[ key ]

}

module.exports = {

    dump: dump,
    has: hasArgument,
    get: getArgument

};
