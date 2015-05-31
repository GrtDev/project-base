// @formatter:off

var config              = require('../config');

var gulp                = require('gulp');
var handlebars          = require('gulp-hb');
var rename              = require('gulp-rename');
var browserSync         = require('browser-sync');
var htmlmin             = require('gulp-htmlmin');
var gulpif              = require('gulp-if');
var path                = require('path');
var frontMatter         = require('gulp-front-matter');

//@formatter:on
/**
 *  Gulp task responsible for compiling the handlebar templates to html.
 *  @see: http://handlebarsjs.com/
 *  @see: https://www.npmjs.com/package/gulp-hb
 */
gulp.task('handlebars', function () {

    var options = {

        source: [
            config.source.getPath('markup', '!(' + config.ignorePrefix + ')*.hbs'),
            config.source.getPath('markup', '!(' + config.ignorePrefix + ')/**/!(' + config.ignorePrefix + ')*.hbs')
        ],
        dest: config.dest.getPath('markup'),

        handlebars: {
            data:       [ config.source.getPath('markup', '_data/**/*.json') ],      // Data that is added to the context when rendering the templates
            helpers:    [ config.source.getPath('markup', '_helpers/**/*.js') ],     // Helpers that are made available in the templates
            partials:   [ config.source.getPath('markup', '_partials/**/*.hbs') ],   // Partials that are made available in the templates

            bustCache:  true,           // default false
            debug:      false,          // Whether to log the helper names, partial names, and root property names for each file as they are rendered.

            // By default, globbed data files are merged into a object structure according to
            // the shortest unique file path without the extension, where path separators determine object nesting.
            parseDataName: parseDataName
            // A pre-render hook to modify the context object being passed to the handlebars template on a per-file basis.
            // May be used to load additional file-specific data.
            //dataEach: onDataEach
        },

        frontmatter:{
            property: 'test', // property added to file object
            remove: true // should we remove front-matter header?
        },


        minify:                 false, //config.minify,
        htmlmin: {
            collapseWhitespace: true,
            removeComments:     true,
            minifyJS:           true,
            minifyCSS:          true,
            keepClosingSlash:   true // can break SVG if not set to true!
        }
    }

    // @formatter:on


    /**
     * Defines under what object the data from the loaded json files can be found.
     * @param file
     * @returns {string}
     */
    function parseDataName(file) {
        // this.handlebars <- current handlebars instance
        // file.path       <- full system path with extension
        // file.shortPath  <- shortest unique path without extension
        // file.exports    <- result of requiring the helper

        // Ignore directory names
        return path.basename(file.path);
    };

    /**
     * A pre-render hook to modify the context object being passed to the handlebars template on a per-file basis.
     * May be used to load additional file-specific data.
     * NOTE: Make sure to pass this function in the options.handlebars config.
     * @param context {object}
     * @param file {Vinyl}
     * @returns {object}
     */
    function onDataEach(context, file) {
        context.foo = 'bar';
        context.meta = require(file.path.replace('.hbs', '.json'));
        return context;
    }

    return gulp.src(options.source)

        .pipe(frontMatter())
        .pipe(handlebars(options.handlebars))

        .pipe(gulpif(options.minify, htmlmin(options.htmlmin)))
        .pipe(rename(function (path) {
            path.extname = '.html';
        }))
        .pipe(gulp.dest(options.dest))
        .pipe(browserSync.reload({stream: true}));

});




