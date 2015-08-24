// @formatter:off

var commonSVGFileList = require('../../partials/svgFileList');
var svgFileList = {};


svgFileList.create = function (source, svgRootPath) {

    return commonSVGFileList.create(source, svgRootPath, function (svgName) {

        return '{% svg ' + '\'' + svgName + '\' %}';

    });

}

module.exports = svgFileList;