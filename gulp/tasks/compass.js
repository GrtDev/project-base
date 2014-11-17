/**
 * Created by gfokke on 11/11/14.
 */
    var gulp = require("gulp");
var compass = require('gulp-compass');
var path = require('path');
var config = require('../config').sass;
var handleErrors = require('../util/handleErrors');

gulp.task('compass', function() {


    gulp.src(config.src)
        .pipe(compass(config.args))
        .on('error', handleErrors);

//gulp.src('/www/Sites/empty-project/source/sass/*.scss')
//        .pipe(compass({
//            project: "/www/Sites/empty-project/",
//            css: 'www/inc/css/',
//            sass: 'source/sass/',
//            image: 'www/inc/images/',
//            relative: true,
//            force: true,
//            http_path: 'http://empty-project.dev/'
//            //bundle_exec: true
//        }))
//        .on('error', handleErrors)

    //gulp.src('/www/Sites/project-boilerplate/source/scss/*.scss')
    //    .pipe(compass({
    //        project: "/www/Sites/project-boilerplate/",
    //        css: 'www/includes/css/',
    //        sass: 'source/scss/'
    //    }))
    //    .on('error', handleErrors);

    //source:     /www/Sites/project-boilerplate/source/scss/*.scss
    //project:    /www/Sites/project-boilerplate/
    //css:        www/includes/css/
    //sass:       source/scss/


 });