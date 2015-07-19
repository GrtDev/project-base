'use strict';
// @param: String
// @return: Angular module
angular.module(<%= computedProjectName %>.Config.computedName)
// @param: String
// @param: Function || Array
// @return: Angular module
.directive('ExampleDirective', function _ExampleDirective () {
	return {
		restrict: 'A',
		link: function (scope, element, attributes) {

		}
	}
});
