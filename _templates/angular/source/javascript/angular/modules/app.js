'use strict';
// Set up our main application module
// @param: String -> Module name as supplied to the ng-app directive wich we use for auto bootstrapping the app
// @param: Array -> Array of dependencies, we inject the ngRoute(used to set up routing) and ngAnimate(used for animation) modules. In other words the module depends on the injected modules to function properly
// @return: Angular module -> Angular module which exposes the module API
angular.module(<%= computedProjectName %>.Config.computedName, <%= computedProjectName %>.Config.dependencies)
// Call the constant method on the module API to configure singleton services. We do this so we can inject cached services with a local reference which will reduce scope chain lookups.
// @param:
// @return: Registered instance
.constant('AppConfig', <%= computedProjectName %>.Config)