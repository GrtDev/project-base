var DEBUG_CLASS_NAME = '_debug-data-log';


/**
 * helper function
 * Add the current context as an element to the page with syntax highlighting
 * @name: debug
 * @usage: {{debug}} or {{debug someValue}}
 * @see: http://thinkvitamin.com/code/handlebars-js-part-3-tips-and-tricks/
 */
module.exports = function debug ( object ) {

    // if the value does not exist or is the helper itself, set it to the context
    if( !object || object.name && object.name === 'debug' ) object = this;

    // exclude these properties from the 'file' property
    var filter = [ 'cache', 'filename', 'context', 'compileDebug', 'client', 'delimiter', 'debug', '_with', 'rmWhitespace' ];
    var filteredContext = {};


    for ( var key in object ) {

        var value = object[ key ];

        if(filter.indexOf(key) === -1) filteredContext[ key ] = value;

    }
    
    console.log(filteredContext);

    return '<div class="' + DEBUG_CLASS_NAME + '"><pre>' + syntaxHighlight( filteredContext ) + '</pre></div>';

};

/**
 * Adds syntax highlighting to json text
 * @see: http://stackoverflow.com/questions/4810841/how-can-i-pretty-print-json-using-javascript
 * @param json {object}
 * @returns {string}
 */
function syntaxHighlight ( json ) {

    for ( var key in json ) {
        var value = json[ key ];
        if( typeof value === 'function' ) json[ key ] = '[ Function ]';
    }

    if( typeof json !== 'string' )  json = JSON.stringify( json, undefined, 2 );

    json = json.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' );

    return json.replace( /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function ( match ) {

        var spanClass = 'number';
        if( /^"/.test( match ) ) {

            if(/\[\sFunction\s\]/.test(match)) spanClass = 'function';
            else if( /:$/.test( match ) )    spanClass = 'key';
            else                        spanClass = 'string';

        } else if( /true|false/.test( match ) )     spanClass = 'boolean';
        else if( /null/.test( match ) )             spanClass = 'null';

        return '<span class="' + spanClass + '">' + match + '</span>';

    } );

}