// @formatter:off

var path                        = require('path');
var log                         = require('./../../util/log');
var requireCachedModule         = require('./../../util/requireCachedModule');
var glob                        = requireCachedModule('glob');
var svg                         = require('../utils/svg');

var SVG_HELPER                   = 'svg';
var SVG_CONTAINER_CLASS         = '_project-svg__container';
var thisFilePath                = __filename.replace(process.cwd(), '')

var DISCLAIMER                  = 'WARNING:\n\nThis partial is auto-generated from gulp!\nSee the \'' + thisFilePath + '\' for details on its creation process.';

// @formatter:on


/**
 * Retrieves a list of page paths
 * @param options {object} the configuration object for the handlebars task
 */
function getSVGList ( source, root ) {

    var svgList = [];

    if( typeof source === 'string' ) {

        svgList = glob.sync( source );

    } else if( Array.isArray( source ) ) {

        for ( var i = 0, leni = source.length; i < leni; i++ ) {

            var sourcePath = source[ i ];
            var list = glob.sync( sourcePath );
            svgList = svgList.concat( list );

        }

    }

    // make sure there is a trailing slash
    if( root.slice( -1 ) !== path.sep ) root += path.sep;

    // Strip the root of the file path
    for ( var i = 0, leni = svgList.length; i < leni; i++ ) {

        var svgPath = svgList[ i ];
        svgList[ i ] = svgPath.replace( root, '' );

    }

    return svgList;
}


/**
 * Converts the svg file list into a HTML svg partial
 * @see gulp/tasks/handlebars.js
 * @name: createHTMLSVGList
 * @param svgCollection {Array}
 * @returns {string}
 */
function createHTMLSVGList ( svgCollection, opt_svgHook ) {

    if( !svgCollection ) return '';

    var html = '';
    var indent = '    ';
    var extensionRegExp = /\.\w*$/;

    // add disclaimer
    html += '<!-- \n\n' + DISCLAIMER + '\n\n-->\n';
    html += '<ul>\n';

    for ( var i = 0, leni = svgCollection.length; i < leni; i++ ) {

        var svgFile = svgCollection[ i ];


        html += indent + '<!-- ' + svgFile + ' -->\n'

        svgFile = svgFile.replace( extensionRegExp, '' ); // strip extension

        html += indent + '<li title="' + svgFile + '">\n';
        html += indent + indent + '<div class="' + SVG_CONTAINER_CLASS + '">\n';


        if( typeof opt_svgHook === 'function' ) {

            html += indent + indent + indent + opt_svgHook( svgFile );

        } else {

            html += indent + indent + indent + svg( svgFile );
        }


        html += '\n';
        html += indent + indent + '</div>\n';
        html += indent + indent + '<h4>' + svgFile + '</h4>\n';
        html += indent + '</li>\n';

    }

    html += '</ul>';

    return html;
};


/**
 * Creates an HTML list with all the file links.
 * @param source {string|Array} source config for the html compilation.
 * @param root {string} the optimized svg root
 * @param opt_svgHook {function=} hook for custom svg handling
 */
function createSVGFileList ( source, root, opt_svgHook ) {

    var svgList = getSVGList( source, root );
    var svgListPartial = createHTMLSVGList( svgList, opt_svgHook );

    return svgListPartial;

}

var svgFileList = { create: createSVGFileList };

module.exports = svgFileList;