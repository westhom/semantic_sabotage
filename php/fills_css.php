<?php

	// Grab CSS files.
	if ($handle = opendir('fills/css')) {
		$styles =  array();
    	/* This is the correct way to loop over the directory. */
    	while (false !== ($entry = readdir($handle))) {
    		if (strpos($entry, ".css"))
	      		$styles[] = $entry;
    	}

	  	closedir($handle);
	}

	foreach($styles as $style) {
		echo "@import url('fills/css/$style');", "\n";
	}
?>