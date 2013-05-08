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
	//$urlData = get_data("http://www.youtube.com/watch?v=0vVCSUafFVI", false);
	
	$startInd = strpos($urlData, "ttsurl") + 10;
	
	$endInd = strpos($urlData, '"', $startInd);
	$ccUrl = substr($urlData, $startInd, $endInd-$startInd);
	$ccUrl = str_replace("\u0026", "&", $ccUrl);
	$ccUrl = str_replace("\/", "/", $ccUrl)."&type=track&lang=en&name&fmt=1";
	//Google's Automatic Speech Recognition : &kind=asr
	//$ccUrl = str_replace("\/", "/", $ccUrl)."&type=track&lang=en&kind=asr&name&fmt=1";
	
	$xml = simplexml_load_file($ccUrl);

	//for justin's reference
	//http://www.youtube.com/api/timedtext?key=yttt1&caps=asr&asr_langs=it%2Ces%2Cnl%2Cfr%2Cde%2Cru%2Cja%2Cko%2Cen%2Cpt&expire=1367978504&v=0vVCSUafFVI&signature=3B123907EF56BD47870A09AC3F2AA4EB673EA16E.8AADF8712FF6D5B02F1D3A0B99D7FF42C9D28EA6&sparams=asr_langs%2Ccaps%2Cv%2Cexpire&hl=en_US&type=track&lang=en&name&kind=asr&fmt=1

	
	$cc =  array();
  foreach ($xml->children() as $text){ 
		$cc[] = $text;
  }

/*	// This is now done in fill_load.php
  	// handle remix listing
	if ($handle = opendir('fills')) {
		$fills =  array();
    // This is the correct way to loop over the directory. 
    while (false !== ($entry = readdir($handle))) {
    	if (strlen($entry) > 2)
	      $fills[] = $entry;
    }

	  closedir($handle);
	}
		
*/
	//echo '{ "cc": "' . json_encode($cc) . '", "url": "' . $ccUrl . '" }';  
	//$response = array("url" => $ccUrl,  "cc" => $cc, "fills" => $fills);
	$response = array("url" => $ccUrl,  "cc" => $cc);

	
	echo json_encode($response); 
	
	
?>