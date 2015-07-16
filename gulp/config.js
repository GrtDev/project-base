/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 *
 * Inspired by the Gulp-starter project of Daniel Tello
 * @author Daniel Tello
 * @link: github.com/greypants/gulp-starter
 *
 */

// @formatter:off


//      Default configuration
//      PLEASE DO NOT CHANGE THESE SETTINGS HERE!
//      Overwrite what you need in the gulpfile.js!


var PathConfig          = require('./util/PathConfig');
var packageJSON         = require('../package.json');

/**
 *  Defines source folders layout.
 *  Creates an object that parses lo-dash templates on itself.
 *  To retrieve a path use the 'getPath' method.
 *
 *  for example: The following script returns the path for the source location of the css (sass) files.
 *
 *  config.dest.getPath('css');
 */
var source              = new PathConfig('./source');
source.bower            = './bower_components'
source.assets           = '<%= root %>/assets'
source.markup           = '<%= root %>/markup';
source.css              = '<%= root %>/sass';
source.javascript       = '<%= root %>/javascript';
source.images           = '<%= assets %>/images';
source.fonts            = '<%= assets %>/fonts';
source.videos           = '<%= assets %>/videos';
source.data             = '<%= assets %>/data';
source.svg              = '<%= assets %>/svg';
source.svgOptimized     = '<%= assets %>/_svg-optimized';

/**
 *  Defines destination folders layout.
 *  Creates an object that parses lo-dash templates on itself.
 *  To retrieve a path use the 'getPath' method.
 *
 *  for example: The following script returns the path for the output destination of the javascript files.
 *
 *  config.dest.getPath('javascript');
 */
var dest                = new PathConfig('./build');
dest.markup             = '<%= root %>';
dest.assets             = '<%= root %>'
dest.css                = '<%= assets %>/css';
dest.javascript         = '<%= assets %>/js';
dest.images             = '<%= assets %>/images';
dest.fonts              = '<%= assets %>/fonts';
dest.videos             = '<%= assets %>/videos';
dest.data               = '<%= assets %>/data';
dest.svg                = '<%= assets %>/svg';
dest.sourcemaps         = '<%= assets %>/sourcemaps';


var config              = {};
config.name             = packageJSON.name;
config.version          = packageJSON.version;
config.source           = source;
config.dest             = dest;

config.ignorePrefix     = '_';      // ignore files and folders with this prefix.
config.debug            = true;
config.verbose          = false;
config.notifyError      = true;
config.throwError       = false;    // Actually throw an error when one occurs, useful for bamboo.

config.minify           = false;
config.sourcemaps       = true;
config.cleanCSS         = false;    // removes unused CSS, requires 'gulp-uncss' installation.
config.prettyHTML       = false;
config.minifyHTML       = false;    // requires 'gulp-htmlmin' installation.

config.gulp             = {
                            debug: false,   // if true, gulp will output a lot of extra information for debugging purposes.
                            lazy: true      // will only load the tasks in the 'gulp/tasks' folder, just before they are used.
                        };


module.exports          = config;