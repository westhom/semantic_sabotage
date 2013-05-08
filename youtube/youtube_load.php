<?php  
	
	// handle youtube cc scraping
	function get_data($url) {
		$ch = curl_init();
		$timeout = 30;
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
		$data = curl_exec($ch);
		curl_close($ch);
		return $data;
	}
	
	function url_exists($url) {
    	if (!$fp = curl_init($url)) return false;
    	return true;
	}

	$urlData = get_data($_POST["url"], false);
	//$urlData = get_data("http://www.youtube.com/watch?v=0vVCSUafFVI", false);
	
	$startInd = strpos($urlData, "ttsurl") + 10;
	
	$endInd = strpos($urlData, '"', $startInd);
	$ccUrl = substr($urlData, $startInd, $endInd-$startInd);
	$ccUrl = str_replace("\u0026", "&", $ccUrl);

	$error = "";

	$ccUrl_good = str_replace("\/", "/", $ccUrl)."&type=track&lang=en&name&fmt=1";
	//Google's Automatic Speech Recognition : &kind=asr
	//$ccUrl = str_replace("\/", "/", $ccUrl)."&type=track&lang=en&kind=asr&name&fmt=1";

	//Justin's probably inefficient check to see if good caption file has elements
	//good caption file always exists, but can be empty
	$handle = @fopen($ccUrl_good, 'r');
	$valid = false;
	while (($buffer = fgets($handle)) !== false) {
	    if (strpos($buffer, $_GET['id']) === false) {
	    	//echo "success ";
	        $valid = TRUE;
	        break; // Once you find the string, you should break out the loop.
	    }      
	}
	fclose($handle);

	if ($valid !== false) {
	    //echo "About to try loading captions.";
	    $error = "GOOD_CAPTIONS";
		$xml = simplexml_load_file($ccUrl_good);

	} else {
		//echo "No Manual Captions";
		$error = "NO_MANUAL_CAPTIONS";
		$ccUrl_asr = str_replace("\/", "/", $ccUrl)."&type=track&lang=en&kind=asr&name&fmt=1";
		$xml = simplexml_load_file($ccUrl_asr);
	}

	$cc =  array();

  	foreach ($xml->children() as $text){ 
		$cc[] = $text;
  	}

  // handle remix listing

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
	$response = array("url" => $ccUrl,  "cc" => $cc, "fills" => $fills, "error" => $error);
	
	
	echo json_encode($response); 
	
		
?>