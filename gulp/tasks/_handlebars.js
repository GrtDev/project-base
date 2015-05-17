// @formatter:off

var gulp                = require('gulp');
var handlebars          = require('gulp-compile-handlebars');
var rename              = require('gulp-rename');
var config              = require('../config');
var handleErrors        = require('../util/handleErrors');
var browserSync         = require('browser-sync');
var htmlmin             = require('gulp-htmlmin');
var gulpif              = require('gulp-if');



gulp.task('handlebars', function () {

    var options = {

        source:     config.source.getPath('markup', '*.hbs'),
        dest:       config.dest.getPath('markup'),
        minify:     config.minify,

        data: {
            title:  config.name
        },

        config: {

            helpers: {
                // Block helper for repeating code sections
                times: function (n, block)
                {
                    var accum = '';
                    for (var i = 0; i < n; ++i) accum += block.fn(i);
                    return accum;
                },
                // Block helper for preserving (angular) syntax
                raw: function (options)
                {
                    return options.fn();
                }
            },

            ignorePartials: false,
            batch: [config.source.getPath('markup')] // set partials folder to the same path as the source so we can easily reference partials in different folders.
        },

        htmlmin: {
            collapseWhitespace: true,
            removeComments:     true,
            minifyJS:           true,
            minifyCSS:          true,
            keepClosingSlash:   true // can break SVG if not set to true!
        }
    }

    // @formatter:on

    return gulp.src(options.source)
        .on('error', handleErrors)
        .pipe(handlebars(options.data, options.config))
        .pipe(gulpif(options.minify, htmlmin(options.htmlmin)))
        .pipe(rename(function (path) {
            path.extname = '.html';
        }))
        .pipe(gulp.dest(options.dest))
        .pipe(browserSync.reload({stream: true}));
});

