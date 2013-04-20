<?php  
	
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
	
	/*$urlData = get_data($_GET["url"], false);
	
	$startInd = strpos($urlData, "ttsurl") + 10;
	
	$endInd = strpos($urlData, '"', $startInd);
	$ccUrl = substr($urlData, $startInd, $endInd-$startInd);
	$ccUrl = str_replace("\u0026", "&", $ccUrl);
	$ccUrl = str_replace("\/", "/", $ccUrl)."&type=track&lang=en&name&kind=asr&fmt=1";
	
	$ccData = get_data($ccUrl, true);
*/

	$ccUrl = "http://www.youtube.com/api/timedtext?expire=1366511278&v=ci5p1OdVLAc&sparams=asr_langs%2Ccaps%2Cv%2Cexpire&signature=51853BAE2375664462BDF6D6EF61D57FBCFBBCB9.5C234759C13D7E43191D2FDE6157C78254F8AB39&hl=en_US&key=yttt1&asr_langs=fr%2Cpt%2Ces%2Cit%2Cen%2Cja%2Cnl%2Cru%2Cde%2Cko&caps=asr&type=track&lang=en&name&kind=asr&fmt=1";
	
	$xml = simplexml_load_file($ccUrl);

	
	$cc =  array();
  foreach ($xml->children() as $text){ 
		$cc[] = $text;
  }
	
	//echo '{ "cc": "' . json_encode($cc) . '", "url": "' . $ccUrl . '" }';  
	$response = array("url" => $ccUrl,  "cc" => $cc);
	
	
	echo json_encode($response); 
	
	
?>