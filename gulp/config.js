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
var PathConfig          = require('./util/PathConfig');
var packageJSON         = require('../package.json');


// Define source folders layout
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

// Define destination folders layout
var dest                = new PathConfig('./www');
dest.markup             = '<%= root %>';
dest.assets             = '<%= root %>/inc'
dest.css                = '<%= assets %>/css';
dest.javascript         = '<%= assets %>/js';
dest.images             = '<%= assets %>/images';
dest.fonts              = '<%= assets %>/fonts';
dest.videos             = '<%= assets %>/videos';
dest.data               = '<%= assets %>/data';


// Create the config object and add all the default settings
var config              = {};
config.name             = packageJSON.name;
config.debug            = true;
config.minify           = false;
config.gulpDebug        = false;
config.verbose          = false;
config.source           = source;
config.dest             = dest;


module.exports          = config;