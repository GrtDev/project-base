//@formatter:off

var log                     = require('./log');
var glob                    = require('glob');
var path                    = require('path');

// @formatter:on


var fileUtils = {};


fileUtils.getList = function ( sourceGlob, opt_stripRoot, opt_stripExtension ) {


    var fileList = [];

    if( typeof sourceGlob === 'string' ) {

        fileList = glob.sync( sourceGlob );

    } else if( Array.isArray( sourceGlob ) ) {

        for ( var i = 0, leni = sourceGlob.length; i < leni; i++ ) {

            var source = sourceGlob[ i ];
            var list = glob.sync( source );
            fileList = fileList.concat( list );

        }

    }


    if( opt_stripRoot !== undefined ) {

        for ( var i = 0, leni = fileList.length; i < leni; i++ ) {

            // convert path to a relative path from the root
            fileList[ i ] = path.relative( opt_stripRoot, fileList[ i ] );

        }
    }

    if( opt_stripExtension ) {

        for ( var i = 0, leni = fileList.length; i < leni; i++ ) {

            // strip extension
            fileList[ i ] = fileList[ i ].replace(/\.\w+$/, '');

        }

    }

    return fileList;

}

module.exports = fileUtils;