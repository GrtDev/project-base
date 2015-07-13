// @formatter:off

var requireCachedModule     = require('requireCachedModule');
var config                  = require('../config');
var log                     = require('log');

var path                    = require('path');
var path                    = require('path');
var gulp                    = requireCachedModule('gulp');
var modernizr               = requireCachedModule('gulp-modernizr');
var browserSync             = requireCachedModule('browser-sync');
var uglify                  = requireCachedModule('gulp-uglify');
var gulpIf                  = requireCachedModule('gulp-if');

//@formatter:on


var abstractTask = {

    extend: function ( task ) {

        for ( var key in abstractTask ) {

            if( !abstractTask.hasOwnProperty( key ) ) continue;
            var property = abstractTask[ key ];

            if( task[ key ] !== undefined ) log.error( {
                sender: 'abstract task',
                message: 'task already has this property! property key: ' + key
            } );

            task[ key ] = property;

        }

        Object.defineProperty( this, 'options', {
            enumerable: true,
            get: function () {
                return this._options;
            }
        } );

    },

    setOptions: function ( options ) {
        this._options = options;
    },

    setTask: function ( task ) {
        this._task = task;
    }

};




