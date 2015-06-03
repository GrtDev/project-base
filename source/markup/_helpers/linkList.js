//@formatter:off

var FILE_PROPERTY               = '_files';
var FOLDER_CLASS_NAME           = 'link-folder';

//@formatter:on

/**
 * Handlebars helper to convert a fileTree object into a list of links.
 * @see gulp/tasks/handlebars.js
 * @name: linkList
 * @param fileTree {object}
 * @returns {string}
 */
module.exports = function ( fileTree ) {

    if( !fileTree ) return '';

    var html = '';
    var indent = '    ';
    var extensionRegExp = /\.\w*$/;

    function parseNode ( node, root, depth ) {

        var offsetCount = depth;
        var offset = '';
        while ( offsetCount-- > 0 ) offset += indent;

        if( node[ FILE_PROPERTY ] ) {

            html += offset + '<ul>\n';

            var files = node[ FILE_PROPERTY ];

            if( files.length && root ) html += '<li class=\"' + FOLDER_CLASS_NAME + '\">' + root + '</li>';

            for ( var i = 0, leni = files.length; i < leni; i++ ) {

                var file = files[ i ];

                html += offset + indent + '<li>\n';
                html += offset + indent + indent + '<a href=\"' + root + '/' + file + '\" target=\"_self\">' + file.replace( extensionRegExp, '' ) + '</a>\n';
                html += offset + indent + '</li>\n';

            }

            for ( var subNodeName in node ) {

                if( !node.hasOwnProperty( subNodeName ) ) continue;
                var subNode = node[ subNodeName ];

                parseNode( subNode, root + '/' + subNodeName, depth + 1 );

            }

            html += offset + '</ul>\n';

        }

    }

    parseNode( fileTree, '', 0 );

    return html;
};