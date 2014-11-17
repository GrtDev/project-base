# Sass / Compass Config

relative_assets = true
line_comments 	= true
force 			= true

# project_path    = "/www/Sites/empty-project/"	# defaults to config.rb location

# directory paths for the sources and output, as seen from project_path
sass_dir        = "source/sass"     			# not really used since we're processing via gulp
css_dir         = "www/inc/css" 			    # not really used since we're processing via gulp
images_dir      = "www/inc/images"
cache_path 		= "source/sass/.sass-cache"		# note: relative to config.rb location

# set the locations of the http paths, these will be used when relative_assets is false
http_path 				= "http://empty-project.dev/"
http_images_dir 		= "inc/images"
http_stylesheets_dir 	= "inc/css"



# TODO: move settings to the config.js and generate this file


