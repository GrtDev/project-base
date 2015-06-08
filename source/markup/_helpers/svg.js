//@formatter:off

var fileSystem              = require( 'fs' );

var SVG_FOLDER              = './source/markup/_data/_export/svg/';
var SVG_CLASS_PREFIX        = 'svg-';

//@formatter:on


/**
 * Handlebars helper to convert a fileTree object into a list of links.
 * @see gulp/tasks/handlebars.js
 * @name: linkList
 * @param fileTree {object}
 * @returns {string}
 */
module.exports = function ( name ) {

    if( !name ) return '';

    name = name.replace(/\.svg$/, '');

    var svg = '';
    var svgPath = SVG_FOLDER + name + '.svg';

    try {

        svg = fileSystem.readFileSync( svgPath );

    } catch ( error ) {

        // log with red color
        console.log( '\033[31mHandlebars svg helper: Failed to retrieve the svg: ' + svgPath );

    }

    return '<span class=\"' + SVG_CLASS_PREFIX + name + '\">' + svg + '</span>';
};