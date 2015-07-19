'use strict';
// @param: String
// @return: Angular module
angular.module(<%= computedProjectName %>.Config.computedName)
// @param: String
// @param: Function || Array
// @return: Angular module
.factory('ExampleTransformRequest', function _ExampleTransformRequest () {
    return function (data, headers) {

        var data = JSON.parse(data);

        return angular.toJson(data);
    }
});
