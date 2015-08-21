// @formatter:off

var path                        = require('path');
var log                         = require('./log');
var requireCachedModule         = require('./requireCachedModule');
var glob                        = requireCachedModule('glob');

var FILE_PROPERTY               = '_files';
var FOLDER_CLASS_NAME           = '_pages-list__folder';
var thisFilePath                = __filename.replace(process.cwd(), '')


var DISCLAIMER                  = 'WARNING:\n\nThis partial is auto-generated from gulp!\nSee the \'' + thisFilePath + '\' for details on its creation process.';

// @formatter:on


/**
 * Retrieves a list of page paths
 * @param options {object} the configuration object for the handlebars task
 */
function getPagesList ( source ) {

    var pagesList = [];

    if( typeof source === 'string' ) {

        pagesList = glob.sync( source );

    } else if( Array.isArray( source ) ) {

        for ( var i = 0, leni = source.length; i < leni; i++ ) {

            var sourcePath = source[ i ];
            var list = glob.sync( sourcePath );
            pagesList = pagesList.concat( list );

        }

    }

    return pagesList;
}

/**
 * Converts an array with file urls into a object tree.
 * @param filePaths {Array}
 * @param treeFileProperty {string} defines on what property the array with files are written to.
 * @param opt_fileExtention {string} replace file extention.
 */
function createFileTree ( filePaths, markupSourceRoot, opt_fileExtention ) {

    var fileTree = {};
    var extensionRegExp = /\.\w*$/;

    for ( var i = 0, leni = filePaths.length; i < leni; i++ ) {

        var pagePath = filePaths[ i ];
        pagePath = path.relative( markupSourceRoot, pagePath );
        if( opt_fileExtention ) pagePath = pagePath.replace( extensionRegExp, '.' + opt_fileExtention );
        pagePath = pagePath.split( path.sep );

        var currentPathNode = fileTree;
        for ( var j = 0, lenj = pagePath.length; j < lenj; j++ ) {

            var pathNode = pagePath[ j ];

            if( j < (lenj - 1) ) {

                if( typeof currentPathNode[ pathNode ] === 'undefined' )  currentPathNode[ pathNode ] = {};
                currentPathNode = currentPathNode[ pathNode ];

            } else {

                if( typeof currentPathNode[ FILE_PROPERTY ] === 'undefined' )  currentPathNode[ FILE_PROPERTY ] = [];
                // the last node is the filename
                currentPathNode[ FILE_PROPERTY ].push( pathNode );

            }

        }

    }

    return fileTree;

}


/**
 * Converts a file tree into a nested HTML list.
 * @name: createHTMLFileTree
 * @param fileTree {object}
 * @returns {string}
 */
function createHTMLFileTree ( fileTree ) {

    if( !fileTree ) return '';

    var html = '';
    var indent = '    ';
    var extensionRegExp = /\.\w*$/;

    // add disclaimer
    html += '<!-- \n\n' + DISCLAIMER + '\n\n-->\n';

    function parseNode ( node, root, depth ) {

        var offsetCount = depth;
        var offset = '';
        while ( offsetCount-- > 0 ) offset += indent;

        if( node[ FILE_PROPERTY ] ) {

            html += offset + '<ul>\n';

            var files = node[ FILE_PROPERTY ];

            if( files.length && root ) html += offset + indent + '<li class=\"' + FOLDER_CLASS_NAME + '\">' + root + '</li>\n';

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


/**
 * Creates an HTML list with all the file links.
 * @param source {string|Array} source config for the html compilation.
 * @param markupRootPath {string} the markup destination
 */
function createHTMLFileList ( source, markupRootPath ) {

    var pagesList = getPagesList( source );
    var pageTree = createFileTree( pagesList, markupRootPath, 'html' );
    var htmlPageTree = createHTMLFileTree( pageTree );

    return htmlPageTree;

}


module.exports = createHTMLFileList;