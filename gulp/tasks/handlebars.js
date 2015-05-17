// @formatter:off

var config              = require('../config');
var handleErrors        = require('../util/handleErrors');

var gulp                = require('gulp');
var handlebars          = require('gulp-hb');
var rename              = require('gulp-rename');
var browserSync         = require('browser-sync');
var htmlmin             = require('gulp-htmlmin');
var gulpif              = require('gulp-if');
var path                = require('path');


/**
 *  Gulp task responsible for compiling the handlebar templates to html.
 *  @see: http://handlebarsjs.com/
 *  @see: https://www.npmjs.com/package/gulp-hb
 */
gulp.task('handlebars', function () {

    var options = {

        source:     config.source.getPath('markup', 'pages/*.hbs'),
        dest:       config.dest.getPath('markup'),

        handlebars: {
            data:       [ config.source.getPath('markup', 'data/**/*.json') ],      // Data that is added to the context when rendering the templates
            helpers:    [ config.source.getPath('markup', 'helpers/**/*.js') ],     // Helpers that are available in the templates
            partials:   [ config.source.getPath('markup', 'partials/**/*.hbs') ],   // Partials that are available in the templates

            bustCache:  true,         // default false
            debug:      false,          // Whether to log the helper names, partial names, and root property names for each file as they are rendered.

            // By default, globbed data files are merged into a object structure according to
            // the shortest unique file path without the extension, where path separators determine object nesting.
            parseDataName: parseDataName
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

    function parseDataName(file) {
        // this.handlebars <- current handlebars instance
        // file.path       <- full system path with extension
        // file.shortPath  <- shortest unique path without extension
        // file.exports    <- result of requiring the helper

        // Ignore directory names
        return path.basename(file.path);
    };

    return gulp.src(options.source)
        .on('error', handleErrors)
        .pipe(handlebars(options.handlebars))

        .pipe(gulpif(options.minify, htmlmin(options.htmlmin)))
        .pipe(rename(function (path) {
            path.extname = '.html';
        }))
        .pipe(gulp.dest(options.dest))
        .pipe(browserSync.reload({stream: true}));
});




