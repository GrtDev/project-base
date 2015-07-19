'use strict';
// @param: String
// @return: Angular module
angular.module(<%= computedProjectName %>.Config.computedName)
// @param: String
// @param: Function || Array
// @return: Angular module
.filter('ExampleFilter', function _ExampleFilter () {
    return function(input) {
        var output = input;
        // modify input and return filtered input
        return output;
    };
});
