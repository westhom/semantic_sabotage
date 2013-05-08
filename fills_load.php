<?php  

	if ($handle = opendir('fills')) {
		$fills =  array();
    	/* This is the correct way to loop over the directory. */
    	while (false !== ($entry = readdir($handle))) {
    		if (strlen($entry) > 2)
	      		$fills[] = $entry;
    	}

	  	closedir($handle);
	}
		
	//echo '{ "cc": "' . json_encode($cc) . '", "url": "' . $ccUrl . '" }';  
	$response = array("fills" => $fills);
	
	echo json_encode($response); 

?>