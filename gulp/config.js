/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 *
 * Inspired by the Gulp-starter project of Daniel Tello
 * @author Daniel Tello
 * @link: github.com/greypants/gulp-starter
 *
 * Note:    Define all path as seen from the gulpfile.js location.
 */

// @formatter:off

var PathConfig          = require('./util/PathConfig');
var packageJSON         = require('../package.json');


var gulpSettings        = {
                            debug: false,
                            lazy: true
                          }


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
source.svg              = '<%= assets %>/svg';
source.svgOptimized     = '<%= markup %>/_data/_export/svg';

// Define destination folders layout
var dest                = new PathConfig('./build');
dest.markup             = '<%= root %>';
dest.assets             = '<%= root %>/inc'
dest.css                = '<%= assets %>/css';
dest.javascript         = '<%= assets %>/js';
dest.images             = '<%= assets %>/images';
dest.fonts              = '<%= assets %>/fonts';
dest.videos             = '<%= assets %>/videos';
dest.data               = '<%= assets %>/data';
dest.svg                = '<%= assets %>/svg';


// Create the config object and add all the default settings
var config              = {};
config.name             = packageJSON.name;
config.ignorePrefix     = '_';
config.debug            = true;
config.minify           = false;
config.verbose          = false;
config.notifyErrors     = true;
config.source           = source;
config.dest             = dest;
config.gulp             = gulpSettings;


/**
 * Bower Dependencies
 * Function that returns a list of bower dependencies to be copied to their destination
 * If possible it is better to use '@import' for scss (instead of css) files
 * or 'require("path_to_file")' for javascript files.
 * @see: https://www.npmjs.com/package/glob
 * For each destination define a config object, e.g.:
 * {
 *      source : [ path_to_file(s) ],
 *      dest: path_to_destination
 * }
 * @return {Array}
 */
config.bowerDependencies = function () {
    return [
        //{
        //    source: ['bootstrap/fonts/**'],
        //    dest: config.dest.getPath('fonts', 'bootstrap/')
        //},
        //{
        //    source: ['jquery/dist/jquery.min.js'],
        //    dest: config.dest.getPath('javascript')
        //}
    ];
}


module.exports          = config;