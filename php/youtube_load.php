<?php
	
	// use curl if available, but fallback to fopen
	function get_data($url) {
		// use https as http urls redirect now
		if(substr($url, 0, 7) == "http://"){
			$url = "https://" . substr($url, 7);
		}
		
		// make
		if  (in_array  ('curl', get_loaded_extensions())) {
			$ch = curl_init();
			$timeout = 30;
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
			curl_setopt($ch, CURLOPT_ENCODING , "gzip");
			
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

	// parse url arguments into $url_fragments
	parse_str( parse_url( $_POST["url"], PHP_URL_QUERY ), $url_fragments);
	
	$urlData = get_data($_POST["url"]);
	
	// find ttsurl var using regex
	$tts_re = "/ttsurl\" ?: ?\"([^\"]+)\"/";
	$matches = array();
	preg_match($tts_re, $urlData, $matches);
	
	$ccUrl = $matches[1];
	$ccUrl = str_replace("\u0026", "&", $ccUrl);
	$ccUrl = str_replace("\/", "/", $ccUrl);
	
	$error = "";

	// Get the list of available caption tracks
	$captions_list_url = $ccUrl . "&type=list&asrs=1";	// Will include automatic subs (asr)
	$captions_list_xml = @simplexml_load_file($captions_list_url);

	if($captions_list_xml) {

		// Find all listed tracks with lang_code="en" (English)
		$english_caption_tracks = $captions_list_xml->xpath("//track[@lang_code='en']");
		
		// Choose the first one that isn't an asr track, if possible
		$chosenTrack = "";

		foreach($english_caption_tracks as $track) {
			if(!isset($track['kind']) || $track['kind'] != "asr") { 
				$chosenTrack = $track;
				$error .= "Found non-asr track.";
				break;
			}			
		}

		// Choose first track if finding a non-asr track failed
		if(!isset($chosenTrack['name'])) { 
			$chosenTrack = $english_caption_tracks[0];
			$error .= "Couldn't find non-asr track. Using first result.";
		}

		// Get chosen track xml file
		$captions_track_url = str_replace("\/", "/", $ccUrl)."&type=track&lang=" . $chosenTrack['lang_code'] .
																		"&name=" . urlencode($chosenTrack['name']) .
																		"&kind=" . $chosenTrack['kind'] .
																		"&fmt=1";
		$captions_track_xml = @simplexml_load_file($captions_track_url);

		// build closed captions array
		$cc = array();
		if($captions_track_xml) {
			
			foreach($captions_track_xml->text as $t) {
				$text = (string) $t; // line text
				$start = (string) $t->attributes()->start; // start time of line
				$dur = (string) $t->attributes()->dur; // duration of line
				$cc[] = array(
					"@attributes" => array(
						"start" => $start,
						"dur" => $dur,
					),
					"0" => $text
				);
			}
		} else
			$error = "Could not load captions (failed to parse XML)";
	} else {
		$error = "No captions available.";
		$captions_track_url = "";
		$cc = "";
	}

	$response = array("youtube_id" => $url_fragments['v'], "url" => $captions_track_url,  "cc" => $cc, "error" => $error);
	echo json_encode($response); 
	
		
?>