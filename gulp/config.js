/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 *
 * Based on the Gulp-starter project of Daniel Tello
 * @author Daniel Tello
 * @link: github.com/greypants/gulp-starter
 */

// @formatter:off

var DEBUG               = true;
var MINIFY              = false;

// Define folder layout
var source              = './source';
var sourceAssets        = source + '/assets';
var sourceImages        = source + '/images';
var sourceVideos        = source + '/video';
var sourceMarkup        = source + '/markup';
var sourceJavaScript    = source + '/javascript';
var sourceCSS           = source + '/sass';

var build               = 'www';
var buildMarkup         = build;
var buildAssets         = build + '/inc';
var buildJavaScript     = buildAssets + '/js';
var buildCSS            = buildAssets + '/css';
var buildImages         = buildAssets + '/images';
var buildVideos         = buildAssets + '/videos';

var projectName         = require('../package.json').name;

// @formatter:on

module.exports = {

    common: {
        debug: DEBUG,
        minify: MINIFY,

        projectName: projectName,

        source: {
            root: source,
            assets: sourceAssets,
            images: sourceImages,
            videos: sourceVideos,
            markup: sourceMarkup,
            javascript: sourceJavaScript,
            css: sourceCSS
        },
        dest: {
            root: build,
            markup: buildMarkup,
            assets: buildAssets,
            images: buildImages,
            videos: buildVideos,
            css: buildCSS,
            javascript: buildJavaScript
        }
    },

    uglify: {},

    htmlmin: {
        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
        keepClosingSlash: true // can break SVG if not set to true!
    },

    cssmin: {},


    browserify: {

        debug: DEBUG, // Enable source maps
        minify: MINIFY,

        // Additional file extentions to make optional
        // extensions: ['.coffee', '.hbs'],

        // A separate bundle will be generated for each bundle config in the list below
        bundleConfigs: [{
            entries: sourceJavaScript + '/main.js',
            dest: buildJavaScript,
            outputName: 'main.js'
        }]

    },

    browserSync: {
        // Use server variable instead of proxy when running local copy without a pre-setup virtual host.
        //server: { baseDir: dest },
        proxy: projectName + '.dev',

        // file changes to trigger a browser refresh
        files: [
            build + '/**.*.css', build + '/**.*.html', build + '/inc/js/main.js'
        ],

        browser: 'google chrome'
    },

    sass: {
        debug: DEBUG,
        minify: MINIFY,
        source: sourceCSS + "/*.{sass,scss}",
        dest: buildCSS,
        settings: {
            // Required if you want to use SASS syntax
            // See https://github.com/dlmanning/gulp-sass/issues/81
            sourceComments: 'map',
            imagePath: sourceImages // Used by the image-url helper
        },
        autoprefixer: {browsers: ['last 3 versions']}
    },

    images: {
        source: sourceImages + '/**',
        dest: buildImages
    },

    prettify: {
        // TODO reimplement prettify?
        source: build,
        dest: build,
        options: {
            indent_size: 2,
            brace_style: 'collapse'
        }

    },

    handlebars: {
        minify: MINIFY,
        watch: [sourceMarkup + '/pages/*.hbs', sourceMarkup + '/partials/*.hbs', sourceMarkup + '/common/partials/*.hbs'],
        source: sourceMarkup + '/pages/*.hbs',
        dest: build,
        templateData: {title: 'Template title'},
        options: {
            ignorePartials: false,
            partials: {},
            batch: [sourceMarkup + '/partials', sourceMarkup + '/common/partials'],
            helpers: {
                capitals: function (str) {
                    return str.toUpperCase();
                }
            }
        }

    }


};


