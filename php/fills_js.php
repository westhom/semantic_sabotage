<?php  

	// Grab javascript files.
	if ($handle = opendir('fills')) {
		$fills =  array();
    	/* This is the correct way to loop over the directory. */
    	while (false !== ($entry = readdir($handle))) {
    		if (strpos($entry, ".js"))
	      		$fills[] = str_replace(".js", "", $entry);
    	}

	  	closedir($handle);
	}
	
	sort($fills);

?>

var modeNames = ['<?php echo implode("','", $fills); ?>'];

<?php

	foreach($fills as $fill) {
		echo file_get_contents("fills/$fill.js"),"\n";
	}

?>

$.each(modeNames, function(i, modeName) {
	var m = new window[modeName](modeName);
	modes.push(m);
});
