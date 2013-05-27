<?php
	
	// handle youtube cc scraping
	function get_data($url) {
		if  (in_array  ('curl', get_loaded_extensions())) {
			$ch = curl_init();
			$timeout = 30;
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
			$data = curl_exec($ch);
			curl_close($ch);
			return $data;
		}
		// Try fopen() if curl doesn't work
		else {
			$f = fopen($url, 'r');
			$data = '';
			while(!feof($f))
				$data .= fread($f, 500);
			fclose($f);
			return $data;
			//die("Curl not enabled.");
		}
	}
	

	//grab the video ID from the URL
	parse_str( parse_url( $_POST["url"], PHP_URL_QUERY ), $url_fragments);

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


	//for justin's reference
	//http://www.youtube.com/api/timedtext?key=yttt1&caps=asr&asr_langs=it%2Ces%2Cnl%2Cfr%2Cde%2Cru%2Cja%2Cko%2Cen%2Cpt&expire=1367978504&v=0vVCSUafFVI&signature=3B123907EF56BD47870A09AC3F2AA4EB673EA16E.8AADF8712FF6D5B02F1D3A0B99D7FF42C9D28EA6&sparams=asr_langs%2Ccaps%2Cv%2Cexpire&hl=en_US&type=track&lang=en&name&kind=asr&fmt=1
	
	$cc =  array();
	foreach ($xml->children() as $text){ 
		$cc[] = $text;
	}

	//echo '{ "cc": "' . json_encode($cc) . '", "url": "' . $ccUrl . '" }';  
	$response = array("youtube_id" => $url_fragments['v'], "url" => $ccUrl,  "cc" => $cc, "error" => $error);
	
	echo json_encode($response); 
	
		
?>