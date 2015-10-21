// @formatter:off

var requireCachedModule     = require('../util/requireCachedModule');
var config                  = require('../config');
var log                     = require('../util/log');

var path                    = require('path');
var changed                 = requireCachedModule('gulp-changed');
var gulp                    = requireCachedModule('gulp');
var svgmin                  = requireCachedModule('gulp-svgmin');
var svg2png                 = requireCachedModule('gulp-svg2png');
var glob                    = requireCachedModule('glob');
var mkdirp                  = requireCachedModule('mkdirp');
var gulpSvgSprite           = requireCachedModule('gulpSvgSprite');
var mergeStream             = requireCachedModule('merge-stream');
var svgmin                  = requireCachedModule('gulp-svgmin');

// @formatter:on


/**
 * Task for optimizing svg images and making them available in the markup.
 * @see https://www.npmjs.com/package/gulp-svg-sprite
 * @see https://www.liquidlight.co.uk/blog/article/creating-svg-sprites-using-gulp-and-sass/
 */
gulp.task( 'sprite', function () {

    var options = {

        svgmin: {
            js2svg: {
                pretty: false // pretty printed svg
            },
            plugins: [
                { removeTitle: true },
                { removeComments: true }
            ]
        },

        svgSprite: {
            mode: {
                css: {
                    spacing: {
                        padding: 5
                    },
                    dest: './',
                    layout: 'diagonal',
                    sprite: 'sprite.svg',
                    bust: false,
                    render: {
                        scss: {
                            dest: path.relative( config.dest.getPath('svg'), config.source.getPath('assets', '/svg-sprite/_sprite.scss')),
                            template: config.source.getPath('assets',  '/svg-sprite/template.mustache')
                        }
                    }
                }
            }
        }

    };

    var pngStream;
    var svgStream;

    svgStream = gulp.src( config.source.getFiles( 'svg' ) )

        .pipe( svgmin( options.svgmin ) )                       // Optimize SVG files
        .pipe( gulpSvgSprite( options.svgSprite ) )             // Create sprite and SASS template
        .on( 'error', log.error )
        .pipe( gulp.dest( config.dest.getPath( 'images' ) ) )
        .on( 'end', function  (  ) {

            pngStream = gulp.src( config.dest.getPath( 'images', options.svgSprite.mode.css.sprite ) )
                .pipe( svg2png() )                                      // Create png fallback
                .pipe( gulp.dest( config.dest.getPath( 'images' ) ) )      // Export
                .on( 'end', function  (  ) {

                    return mergeStream(svgStream, pngStream);

                });

        } );

} );
