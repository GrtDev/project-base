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
        src: source + "/sass/*.{sass,scss}",
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
        src:    source + '/sass/*.scss',
        args : {
            config_file:  'config.rb',              // as seen from project root (gulpfile.js location)
            sass:         source + '/sass',         // location fo scss files
            css:          buildAssetsDir + '/css'   // destination of css files
        }
    },

    images: {
        src:    sourceAssetsDir + '/images/**',
        dest:   buildAssetsDir + '/images'
    },

    markup: {
        src:    source + '/markup/**/*.html',
        dest:   build
    },

    prettify: {
        src:    build,
        dest:   build
    },

    gulpGrunt: {
        verbose: false
    },

    assemble: {

        options: {
            assets:     buildAssetsDir,
            data:       sourceMarkup + '/data/*.json',
            partials:   [sourceMarkup + '/partials/**/*.hbs', sourceMarkup + '/common/partials/**/*.hbs'],
            helpers:    [sourceMarkup + '/helpers/**/*.js', sourceMarkup + '/common/helpers/**/*.js'],
            layoutdir:  sourceMarkup + '/common/layouts'
        },
        project: {

            options: {
                layout: 'default.hbs'
            },

            files: [{
                expand: true,
                cwd:    source + '/markup/pages',
                src:    ['*.hbs', '!_*'],
                dest:   build
            }]
        }
    }

};


