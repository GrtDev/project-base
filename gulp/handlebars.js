//@formatter:off

var gulp                    = require('gulp');
var handlebars              = require('gulp-compile-handlebars');
var handleErrors            = require('../utils/handleErrors');
var rename                  = require('gulp-rename');
var config                  = require('../config');
var browserSync             = require('browser-sync');

//@formatter:on


gulp.task('handlebars', function () {

    var options = {

        source: config.source.markup + '/*.hbs',
        dest: config.dest.markup,

        templateData: {title: 'HTM - Website'},


        config: {

            helpers: {
                times: function (n, block)
                {
                    var accum = '';
                    for (var i = 0; i < n; ++i)
                        accum += block.fn(i);
                    return accum;
                },
                raw: function (options)
                {
                    var raw = options.fn();
                    
                    raw = raw.replace(/"\/image\//g, '"http://www.htm.nl/image/');
                    raw = raw.replace(/"img\//g, '"http://www.htm.nl/image/');

                    return raw;
                }
            },

            ignorePartials: false,
            batch: [config.source.markup] // set partials folder to the same path as the source so we can easily reference partials in different folders.
        }

    };

    return gulp.src(options.source)
        .pipe(handlebars(options.templateData, options.config))
        .on('error', handleErrors)
        .pipe(rename(function (path) {
            path.extname = '.html';
        }))
        .pipe(gulp.dest(options.dest))
        .pipe(browserSync.reload({stream: true}));

});
