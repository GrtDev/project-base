//@formatter:off

var template            = require('lodash.template');
var pathUtil            = require('path');
var gulpUtil            = require('gulp-util');
var log                 = require('./log');

//@formatter:on

/**
 * Simple object containing a function to parse lodash path variables on itself.
 * @param root {string} automatically sets the root property for the config.
 * @constructor
 */
function PathConfig ( root ) {

    var _this = this;
    var _context;

    _this.root = { path: root };


    // A RegExp to test whether a string contains a lodash template.
    // @see https://lodash.com/docs#template
    var _loDashTemplateRegExp = /<%=\s*\w+\s*%>/

    /**
     * The path string can be a lodash template, this functions passes
     * it through gulp-util.template to render the correct output.
     * @see https://github.com/gulpjs/gulp-util#templatestring-data
     *
     * @public
     * @function getPath
     * @param name {string}                     name of the path required.
     * @param opt_pathExtension {=string}       optional path extension to be appended to the path.
     * @return {string}                         fully rendered (file) path.
     */
    _this.getPath = function ( name, opt_pathExtension ) {

        if( !_context ) createContext();

        if( !_this.hasOwnProperty( name ) ) {
            gulpUtil.log( gulpUtil.colors.red( 'Error: Path config with name: \'' + name + '\' was not found!' ) );
            return '';
        }

        var path = _this[ name ][ 'path' ];

        var loopNum = 0, maxRecursion = 10;
        while ( _loDashTemplateRegExp.test( path ) && loopNum <= maxRecursion ) {
            path = template( path );
            path = path( _context );

            if( loopNum++ > maxRecursion ) gulpUtil.log( gulpUtil.colors.red( 'Error: Maximum recursion (' + maxRecursion + ') reached or failed to compile path template for name: \'' + name + '\'. Compiled path: \'' + path + '\'' ) );
        }

        var path = opt_pathExtension ? path + '/' + opt_pathExtension : path;

        return pathUtil.normalize( path );
    }

    /**
     * Returns the file path glob that was defined in the named data
     * @param name
     * @returns {string|Array}
     */
    _this.getFiles = function ( name ) {

        if( !_context ) createContext();

        if( !_this.hasOwnProperty( name ) ) {
            gulpUtil.log( gulpUtil.colors.red( 'Error: Path config with name: \'' + name + '\' was not found!' ) );
            return '';
        }

        var pathData = _this[ name ];
        var filesGlob = pathData[ 'files' ];
        var filePathsGlob;

        if( filesGlob === undefined ) return log.error( {
            sender: 'PathConfig',
            message: 'attempting getFiles on a config that does not contain a files configuration: \'' + name + '\''
        } );


        if( Array.isArray( filesGlob ) ) {

            filePathsGlob = [];

            for ( var i = 0, leni = filesGlob.length; i < leni; i++ ) {

                filePathsGlob.push( _this.getPath( name, filesGlob[ i ] ) );

            }

        } else {

            filePathsGlob = _this.getPath( name, filesGlob );

        }

        return filePathsGlob;

    }

    /**
     * Generates the context in which paths are parsed.
     */
    function createContext () {

        _context = {};

        for ( var pathName in _this ) {

            if( !_this.hasOwnProperty( pathName ) ) continue;

            var pathData = _this[ pathName ];
            _context[ pathName ] = pathData.path;

        }

    }

    /**
     * A function to log all the path variables.
     * Useful for checking if they're all set correctly
     * @public
     * @function dump
     */
    _this.dump = function () {
        console.info( 'Path config dump:' );
        for ( var property in _this ) {
            if( !_this.hasOwnProperty( property ) || typeof _this[ property ] !== 'object' ) continue;
            console.info( '\t' + property + ( property.length >= 7 ? ':\t\'' : ':\t\t\'') + _this.getPath( property ) + '\'' );
        }
    }
}

module.exports = PathConfig;