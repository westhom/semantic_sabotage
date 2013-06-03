<?php

	//grab the video ID from the URL
	parse_str( parse_url( $_POST["url"], PHP_URL_QUERY ), $url_fragments);

	$response = file_get_contents("./responses/".$url_fragments['v'].".json");
	echo $response;
	
		
?>