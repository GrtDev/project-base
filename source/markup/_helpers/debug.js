
var DEBUG_CLASS_NAME = 'handlebars-debug';


/**
 * Handle bar helper function
 * Add the current context as an element to the page with syntax highlighting
 * @name: debug
 * @usage: {{debug}} or {{debug someValue}}
 * @see: http://thinkvitamin.com/code/handlebars-js-part-3-tips-and-tricks/
 */
module.exports = function ( opt_value ) {

    // if the value does not exist or is the helper itself, set it to the context
    if( !opt_value || opt_value.name && opt_value.name === 'debug' ) opt_value = this;

    // exclude these properties from the 'file' property
    var filter = [ 'history', 'cwd', 'base', 'stat', '_contents', 'isBuffer', 'isStream', 'isNull', 'isDirectory', 'clone', 'pipe', 'inspect' ];
    var mergedContext = {};


    for ( var key in opt_value ) {

        var value = opt_value[ key ];

        if( key === 'file' ) {

            mergedContext[ 'file' ] = {};

            // Filter contents of the 'file' property since its polluted by gulp/node
            // But it is used by FrontMatter so we do include it.
            for ( var fileKey in opt_value[ 'file' ] ) {

                if( filter.indexOf( fileKey ) >= 0 ) continue; // skip

                mergedContext[ 'file' ][ fileKey ] = opt_value[ 'file' ][ fileKey ];

            }

        } else {

            mergedContext[ key ] = value;

        }
    }

    return '<div class="' + DEBUG_CLASS_NAME + '"><pre>' + syntaxHighlight( mergedContext ) + '</pre></div>';;

};

/**
 * Adds syntax highlighting to json text
 * @see: http://stackoverflow.com/questions/4810841/how-can-i-pretty-print-json-using-javascript
 * @param json {object}
 * @returns {string}
 */
function syntaxHighlight ( json ) {

    if( typeof json !== 'string' )  json = JSON.stringify( json, undefined, 2 );

    json = json.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' );

    return json.replace( /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function ( match ) {

        var spanClass = 'number';
        if( /^"/.test( match ) ) {

            if( /:$/.test( match ) )    spanClass = 'key';
            else                        spanClass = 'string';

        } else if( /true|false/.test( match ) )     spanClass = 'boolean';
        else if( /null/.test( match ) )             spanClass = 'null';

        return '<span class="' + spanClass + '">' + match + '</span>';

    } );

}