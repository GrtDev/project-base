/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 *
 * Based on the Gulp-starter project of Daniel Tello
 * @author Daniel Tello
 * @link: github.com/greypants/gulp-starter
 */

// @formatter:off

var gulp                = require('gulp');
var gulpUtil            = require('gulp-util');
var template            = require('lodash.template');
var packageJSON         = require('../package.json');


var source              = new PathConfig('./source');
source.assets           = '<%= root %>/assets'
source.markup           = '<%= root %>/markup';
source.css              = '<%= root %>/sass';
source.javascript       = '<%= root %>/javascript';
source.images           = '<%= assets %>/images';
source.fonts            = '<%= assets %>/fonts';
source.videos           = '<%= assets %>/videos';
source.data             = '<%= assets %>/data';


var dest                = new PathConfig('./www');
dest.markup             = '<%= root %>';
dest.assets             = '<%= root %>/inc'
dest.css                = '<%= assets %>/css';
dest.javascript         = '<%= assets %>/js';
dest.images             = '<%= assets %>/images';
dest.fonts              = '<%= assets %>/fonts';
dest.videos             = '<%= assets %>/videos';
dest.data               = '<%= assets %>/data';


var config              = {};
// default settings
config.name             = packageJSON.name;
config.debug            = true;
config.minify           = false;
config.gulpDebug        = false;

config.source           = source;
config.dest             = dest;


module.exports          = config;


// @formatter:on


/**
 * Simple object containing a function to parse lodash path variables on itself.
 * @param root {string} automatically sets the root property for the config.
 * @constructor
 */
function PathConfig(root) {

    var _this = this;
    _this.root = root;

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
     * @param name {string}             name of the path required.
     * @param opt_fileName {=string}    optional file name to add to the path.
     * @return {string}                 fully rendered (file) path.
     */
    _this.getPath = function(name, opt_fileName) {
        if(!_this.hasOwnProperty(name)){
            gulpUtil.log(gulpUtil.colors.red('Error: Path with name: \'' + name + '\' was not found!'));
            return '';
        }

        var path = _this[name];

        var loopNum = 0, maxRecursion = 10;
        while (_loDashTemplateRegExp.test(path) && loopNum <= maxRecursion)
        {
            path = template(path);
            path = path(_this);

            if(loopNum++ > maxRecursion) gulpUtil.log(gulpUtil.colors.red('Error: Maximum recursion (' + maxRecursion + ') reached or failed to compile path template for name: \'' + name + '\'. Compiled path: \'' + path + '\''));
        }

        return opt_fileName ? path + '/' + opt_fileName : path;
    }
    /**
     * A function to log all the path variables.
     * Useful for checking if they're all set correctly
     * @public
     * @function dump
     */
    _this.dump = function () {
        console.info('Path config dump:');
        for (var property in _this)
        {
            if(!_this.hasOwnProperty(property) || typeof _this[property] !== 'string') continue;
            console.info('\t' + property + (property.length >= 7 ? ':\t\'' : ':\t\t\'') + _this.getPath(property) + '\'');
        }
    }
}