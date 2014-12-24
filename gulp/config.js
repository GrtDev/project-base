/**
 * @author Geert Fokke - geert@sector22.com
 * @link www.sector22.com
 *
 * Based on the Gulp-starter project of Daniel Tello
 *  ~ https://github.com/greypants/gulp-starter
 */

// @formatter:off

var source          = 'source';
var sourceAssetsDir = source + '/assets';
var sourceMarkup    = source + '/markup';

var build           = 'www';
var buildAssetsDir  = build + '/inc';

var projectName     = require('../package.json').name;


module.exports = {

    browserify: {

        // Enable source maps
        debug: true,

        // Additional file extentions to make optional
        // extensions: ['.coffee', '.hbs'],

        // A separate bundle will be generated for each bundle config in the list below
        bundleConfigs: [{
            entries:    source + '/javascript/main.js',
            dest:       buildAssetsDir + '/js',
            outputName: 'app.js'
        }]

    },

    browserSync: {

        // Use server variable instead of proxy when running local copy without a pre-setup virtual host.
        //server: { baseDir: dest },
        proxy: projectName + '.dev',


        // file changes to trigger a browser refresh
        files: [
            build + '/**.*.css', build + '/**.*.html', build + '/**.*.js'
        ],

        browser: 'google chrome'
    },

    sass: {
        source: source + "/sass/*.{sass,scss}",
        dest: buildAssetsDir + '/css',
        settings: {
            // Required if you want to use SASS syntax
            // See https://github.com/dlmanning/gulp-sass/issues/81
            sourceComments: 'map',
            imagePath: '/inc/images' // Used by the image-url helper
        },
        autoprefixer: { browsers: ['last 2 version'] }
    },


    _sass: {
        source:    source + '/sass/*.scss',
        args : {
            config_file:  'config.rb',              // as seen from project root (gulpfile.js location)
            sass:         source + '/sass',         // location fo scss files
            css:          buildAssetsDir + '/css'   // destination of css files
        }
    },

    images: {
        source:    sourceAssetsDir + '/images/**',
        dest:   buildAssetsDir + '/images'
    },

    prettify: {
        source:    build,
        dest:   build
    },

    handlebars :{
        source: sourceMarkup + '/pages/*.hbs',
        dest: build,
        templateData: {title:'Template title'},
        options: {
            ignorePartials: false,
            partials : {},
            batch : [sourceMarkup + '/partials', sourceMarkup + '/common/partials'],
            helpers : {
                capitals : function(str){
                    return str.toUpperCase();
                }
            }
        }
    }


};


