'use strict';

var <%= computedProjectName %> = (function appConfig (<%= computedProjectName %>, window, undefined) {

	<%= computedProjectName %>.Config = {
		name : '<%= projectName %>',
		computedName : '<%= computedProjectName %>',
		dependencies :  [<% for(i=0;i<angularModules.length;i++) { %><% if ( i != 0 ) { %>,<% }%>'<%= angularModules[i] %>'<% } %>]
	};

	return <%= computedProjectName %>;

}(<%= computedProjectName %> || {}, window));