<?php
header('X-Frame-Options: GOFORIT'); 
?>

<html>
	
	<head>
	
	<title>Eyeo</title>
        
	<link rel="stylesheet" href="./style.css" type="text/css" media="screen, projection">
	
	<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
	<script src="http://code.jquery.com/jquery-migrate-1.1.0.min.js"></script>
  <script src="http://malsup.github.com/jquery.form.js"></script> 
  
  <script> 
      // wait for the DOM to be loaded 
      $(document).ready(function() { 
          // bind 'myForm' and provide a simple callback function 
          $('#youtube_load').ajaxForm({ 
		        // dataType identifies the expected content type of the server response 
		        dataType:  'json', 
		 
		        // success identifies the function to invoke when the server response 
		        // has been received 
		        success:   load 
          }); 
      }); 
  </script> 
		
	<script src="./localStorageDB/localstoragedb.min.js"></script>
	<script src="./config.js"></script>
	<script src="./statsHandler.js"></script>
	<script src="./parser.js"></script>
	<script src="./fill.js"></script>
	<script src="./player.js"></script>
	<script src="./sabotage.js"></script>

	<!--<script src="https://apis.google.com/js/client.js?onload=load"></script>-->
	</head>
	
	
	
	<body onLoad="init()">
	
		enter a youtube url for a video with captions.
		
    <div id="loading" style="display:none">LOADING...</div>
    
    <div id="video"></div>
    
    <form id="youtube_load" action="youtube_load.php"  method="post">
			URL: <input type="text" value="http://www.youtube.com/watch?v=ci5p1OdVLAc" name="url">
			<input type="submit"  value="Submit">
		</form>
    
    <button id="playButton" style="display:none" onclick="playback();">PLAYBACK</button>
    <button id="stopButton" style="display:none" onclick="stopPlayback();">STOP</button>
    
    
		<div id="words"></div>
    <div id="results"></div>
	
	</body>
	
</html>





