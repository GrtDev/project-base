/**
 * Created by gfokke on 12/11/14.
 */

var config = require('./gulp/config.js').assemble;

module.exports = function (grunt) {

    // NOTE:    Grunt is loaded and called via gulp to be able to use the assemble module
    //          Configuration is done in gulp/config.js

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // All configurations are done in the gulp config.js
        assemble: config

    });

    // load module
    grunt.loadNpmTasks('assemble');

    // register task
    grunt.registerTask('grunt-assemble', ['assemble']);

};