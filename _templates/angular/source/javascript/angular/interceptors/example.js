'use strict';
// @param: String
// @return: Angular module
angular.module(<%= computedProjectName %>.Config.computedName)
// @param: String
// @param: Function || Array
// @return: Angular module
.factory('ExampleInterceptor', function _ExampleInterceptor ($q) {
    return {
        responseError: function exampleInterceptorResponseError (rejection) {
            if (rejection.status === 401) {
                // Do something example: Emit event
            }
            // Default. Will end up on the '$routeChangeError' event or the promise fail handler.
            return $q.reject(rejection);
        }
    }
});
