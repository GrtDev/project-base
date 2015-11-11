/**
 * @author Geert Fokke [ geert@sector22.com ]
 * @www sector22.com
 *
 * Inspired by the Gulp-starter project of Daniel Tello
 * @author Daniel Tello
 * @link: github.com/greypants/gulp-starter
 *
 */

// @formatter:off

var PathConfig          = require('./util/PathConfig');
var packageJSON         = require('../package.json');


//      Default configuration
//      PLEASE DO NOT CHANGE THESE SETTINGS HERE!
//      Overwrite what you need in the gulpfile.js!


var config              = {};
config.name             = packageJSON.name;
config.version          = packageJSON.version;

config.cleanBuild       = false;
config.ignorePrefix     = '_';      // ignore files and folders with this prefix.
config.debug            = true;
config.notifyError      = true;
config.throwError       = false;    // Actually throws an (native) error when one occurs, useful for bamboo.

config.minify           = false;
config.optimizeImages   = true;
config.sourcemaps       = true;
config.cleanCSS         = false;    // removes unused CSS, requires 'gulp-uncss' installation.
config.prettyHTML       = false;
config.minifyHTML       = false;    // requires 'gulp-htmlmin' installation.

config.gulp             = {
    debug: false,       // if true, gulp will output a lot of extra information for debugging purposes.
    lazy: true,         // will only load the tasks in the 'gulp/tasks' folder, just before they are used.
    verbose: false      // Output extra information during the process.
};





/**
 *  Defines source & destination folders layout and source files.
 *  Creates an object that parses lo-dash templates on itself.
 *  To retrieve a path use the 'getPath' method.
 *  To retrieve a file glob use the 'getFileGlob' method.
 *
 *  for example: The following script returns the path for the source location of the css (sass) files.
 *
 *  config.dest.getPath('css');
 */

var ignore = '!(' + config.ignorePrefix + ')';      // will negate any matches started with a ignore prefix

var source = config.source  = new PathConfig('./source');
source.bower                = { path: './bower_components' };
source.html                 = { path: '<%= root %>/html',                       files: ignore + '*.html' };
source.data                 = { path: '<%= html %>/data',		                files: '**.json' };
source.css                  = { path: '<%= root %>/sass',		                files: ignore + '*.scss' };
source.javascript           = { path: '<%= root %>/javascript',	                files: ignore + '*.js' };
source.assets               = { path: '<%= root %>/assets',		                files: ignore + '**' };
source.images               = { path: '<%= assets %>/images',	                files: [ ignore + '*.{jpg,jpeg,png,gif}', '**/' + ignore + '*.{jpg,jpeg,png,gif}' ] };
source.svg                  = { path: '<%= assets %>/svg',		                files: [ ignore + '*.svg', ignore + '*/**.svg' ] };
source.markupPartials       = { path: '<%= html %>/' + config.ignorePrefix + 'partials'};


var dest = config.dest      = new PathConfig('./build');
dest.html                   = { path: '<%= root %>' };
dest.css                    = { path: '<%= assets %>/css' };
dest.javascript             = { path: '<%= assets %>/js' };
dest.assets                 = { path: '<%= root %>' };
dest.images                 = { path: '<%= assets %>/images' };
dest.fonts                  = { path: '<%= assets %>/fonts' };
dest.svg                    = { path: '<%= assets %>/svg' };
dest.sourcemaps             = { path: '<%= assets %>/sourcemaps' };



module.exports              = config;