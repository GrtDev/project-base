//@formatter:off

var log                     = require('./log');
var config                  = require('../config');
var path                    = require('path');
var requireCachedModule     = require('../util/requireCachedModule');
var glob                    = requireCachedModule('glob');

var jsonFileRegExp          = /.json$/i;

// @formatter:on

/**
 * Loads and merges JSON data into one object
 * @param root {string} root path to be stripped of the filepath
 * @param source {string} glob string for JSON
 */
function mergeJSONData ( root, source ) {

    if( root.slice( -1 ) !== path.sep ) root += path.sep; // force path separator as last character

    var data = {};
    var files = glob.sync( source );

    for ( var i = 0, leni = files.length; i < leni; i++ ) {

        var filePath = files[ i ];

        if( !jsonFileRegExp.test( filePath ) ) {
            log.warn( { sender: 'mergeJSONData', message: 'Can only merge JSON Data!' } );
            continue;
        }

        var relativePath = path.relative( __dirname, filePath );
        var fileData = require( relativePath );

        var dataPath = filePath.replace( root, '' );
        dataPath = dataPath.replace( jsonFileRegExp, '' );
        dataPath = dataPath.split( path.sep );

        var currentNode = data;
        for ( var j = 0, lenj = dataPath.length; j < lenj; j++ ) {

            var key = dataPath[ j ];
            if( !key.length ) continue;
            currentNode[ key ] = currentNode[ key ] || {};

            currentNode = currentNode[ key ];

        }

        currentNode[ key ] = fileData;

    }

    return data;

}


module.exports = mergeJSONData;