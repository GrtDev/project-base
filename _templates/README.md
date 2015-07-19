Templates
============

This folder contains template configurations for when the project is setup via the yeoman generator.
Files that are already there from a previous configuration will be overwritten.

For example: if a main.js file is included in a specific configuration, 
this will overwrite the file that was included form the '_common' configuration.

An exception to this is the package.json, this will be merged into an existing package.json.


_common:
Files in this folder will be available in all configurations.

angular:
Files specific for the angular configuration. Will be combined with either handlebars or fileinclude.

handlebars: 
Files specific for the handlebars configuration.

fileinclude: 
Files specific for the fileinclude configuration.
