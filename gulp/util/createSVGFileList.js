// @formatter:off

var path                        = require('path');
var log                         = require('./log');
var requireCachedModule         = require('./requireCachedModule');
var glob                        = requireCachedModule('glob');

var PARTIAL_TYPE_HANDLEBARS     = 'handlebars';
var PARTIAL_TYPE_FILEINCLUDE    = 'fileinclude';

var SVG_HANDLEBARS_HELPER       = 'svg';
var SVG_CONTAINER_CLASS         = 'project-svg__container';
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
 * @param partialType {string}
 * @returns {string}
 */
function createHTMLSVGList ( svgCollection, partialType ) {

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

        if( partialType === PARTIAL_TYPE_HANDLEBARS ) {

            html += indent + indent + indent + '{{{ ' + SVG_HANDLEBARS_HELPER + ' \'' + svgFile + '\' }}}\n';

        } else if( partialType === PARTIAL_TYPE_FILEINCLUDE ) {

            html += indent + indent + indent + '{{{ ' + SVG_HANDLEBARS_HELPER + ' \'' + svgFile + '\' }}}\n';

        }

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
 * @param svgRootPath {string} the optimized svg root
 * @param type {string} type of the partials, valid values are: 'handlebars' and 'fileInclude'.
 */
function createSVGFileList ( source, svgRootPath, partialType ) {

    partialType = partialType.toLowerCase();

    if( partialType !== PARTIAL_TYPE_FILEINCLUDE && partialType !== PARTIAL_TYPE_HANDLEBARS ) {

        log.error( {
            sender: 'createSVGFileList',
            message: 'invalid partial type given! partialType: \'' + partialType + '\', valid values are: \'' + PARTIAL_TYPE_FILEINCLUDE + '\' and \'' + PARTIAL_TYPE_HANDLEBARS + '\''
        } );
        return;
    }

    var svgList = getSVGList( source, svgRootPath );
    var svgListPartial = createHTMLSVGList( svgList, partialType );

    return svgListPartial;

}


module.exports = createSVGFileList;