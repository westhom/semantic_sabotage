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
	
	
	$urlData = get_data($_POST["url"], false);
	//$urlData = get_data("http://www.youtube.com/watch?v=ci5p1OdVLAc", false);
	
	$startInd = strpos($urlData, "ttsurl") + 10;
	
	$endInd = strpos($urlData, '"', $startInd);
	$ccUrl = substr($urlData, $startInd, $endInd-$startInd);
	$ccUrl = str_replace("\u0026", "&", $ccUrl);
	$ccUrl = str_replace("\/", "/", $ccUrl)."&type=track&lang=en&name&kind=asr&fmt=1";
	
	$xml = simplexml_load_file($ccUrl);

	
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
	$response = array("url" => $ccUrl,  "cc" => $cc, "fills" => $fills);
	
	
	echo json_encode($response); 
	
	
?>