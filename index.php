<!DOCTYPE html>
<!--
   _____                            __  _     
  / ___/___  ____ ___  ____ _____  / /_(_)____
  \__ \/ _ \/ __ `__ \/ __ `/ __ \/ __/ / ___/
 ___/ /  __/ / / / / / /_/ / / / / /_/ / /__  
/____/\___/_/ /_/ /_/\__,_/_/ /_/\__/_/\___/  

   _____       __          __                 
  / ___/____ _/ /_  ____  / /_____ _____ ____ 
  \__ \/ __ `/ __ \/ __ \/ __/ __ `/ __ `/ _ \
 ___/ / /_/ / /_/ / /_/ / /_/ /_/ / /_/ /  __/
/____/\__,_/_.___/\____/\__/\__,_/\__, /\___/ 
                                 /____/       
-->
<html class="no-js">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

		<title>Semantic Sabotage</title>
		<meta name="description" content="Semantic Sabotage, an open source platform for creating live typographic YouTube mutations. By Sosolimited.">
		
		<link rel="shortcut icon" href="favicon.ico" >
		<link rel="stylesheet" href="css/style.css" type="text/css" media="screen, projection">
		<link rel="stylesheet" href="css/fonts.css" type="text/css" media="screen, projection">
		<link rel="stylesheet" href="css/nav.css" type="text/css" media="screen, projection">
		<link rel="stylesheet" href="css/libs/animate-custom.css" type="text/css" media="screen, projection">
		<style type="text/css">
			<?php include 'php/fills_css.php'; ?>
		</style>
		
		<!-- Use Google CDN for jQuery -->
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
		<!-- Typekit -->
		<script type="text/javascript" src="//use.typekit.net/rim7nin.js"></script>
		<script type="text/javascript">try{Typekit.load();}catch(e){}</script>
		
		<!-- Gets rid of Indonesian translation request -->
		<meta name="google" content="notranslate" />
		<!-- Rest of JS is below HTML for faster DOM rendering -->
	</head>

	<body onclick="bodyClick();">
		<div class="navBar">

			<div id="navTitle" class="medGray navText proxima-nova-700" onclick="showMenu();">Semantic Sabotage</div>			

			<div id="navControls" style="display:none">
				<form id="youtube_load" class="navInput">
					<input id="ytURLButton" class="navButton proxima-nova-400" style="position: absolute; width: 1px; height: 1px; left: -9999px;" type="submit" onclick="submitURL();">
					<div id="loading" class="navStatus proxima-nova-400" style="display:none">Loading...</div>
					<div id="playing" class="navStatus proxima-nova-400" style="display:none">Playing...</div>
					<input id="ytURL" class="navInput proxima-nova-400" type="text" onfocus="if(this.value.indexOf('Enter a') !== -1) { this.value = ''; }" onblur="if(this.value == '') { this.value = 'Enter a different YouTube URL'; }" value='Enter a YouTube URL.' name="url" size="44">
					<button id="playButton" class="navButton" style="display:none" onclick="playback();"><img class="icon" src="img/icons/play.png" data-icon="play"></button>
					<button id="pauseButton" class="navButton" style="" onclick="pausePlayback();"><img class="icon" src="img/icons/pause.png" data-icon="pause"></button>
					<button id="muteButton" class="navButton" style="" onclick="muteVideo();"><img class="icon" src="img/icons/mute.png" data-icon="mute"></button>
					<button id="unmuteButton" class="navButton" style="display:none" onclick="unMuteVideo();"><img class="icon" src="img/icons/sound.png" data-icon="sound"></button>
					<button id="fullscreenButton" class="navButton" style="" onclick="toggleFullscreen();"><img class="icon" src="img/icons/fullscreen.png" data-icon="fullscreen"></button>
					<div class="navMeta">
						<span class="navTitle proxima-nova-700"></span>
						<span class="navAuthor meta-serif-book-italic"></span>
					</div>
				</form>
			</div>
			<a id="logo_link" href="http://sosolimited.com" target="_blank"><img id="logo" src="img/sosoLogoSmall.png"/></a>


		</div>
		
		<div id="progressBarBox"> 
			<div id="progressBar"></div>
		</div>

		<div id="videoDiv"></div>

		<div id="unsupported" class="proxima-nova-400-italic">Check out Semantic Sabotage in Chrome, Safari, or Firefox.</div>

		<div id="menu">
				
			<div id="columnLeft" class="column animated delay fadeIn">
				<div class="menuHeading meta-serif-book-italic">Gallery</div>
				<ul id="transforms"></ul>
			</div>

			<div id="columnRight" class="column animated delay fadeIn">
				<div class="menuHeading meta-serif-book-italic">About</div>

				<div id="aboutBody" class="meta-serif-book">
					<p class="aboutIntro meta-serif-book-italic">Semantic Sabotage is an open source platform for creating live typographic YouTube transforms.</p>
					<br>
					Each transform uses HTML5 and Javascript to visualize the transcript of a YouTube movie, as it plays. The transcripts are analyzed with the LIWC dictionaries, created by <a href="http://www.secretlifeofpronouns.com/author.php" target="_blank">James Pennebaker</a> and the UT Austin Department of Psychology.
					<br>
					<br>
					Semantic Sabotage was designed and coded by <a href="http://sosolimited.com" target="_blank">Sosolimited</a>.
					<br>
					<br>
				</div>

				<div class="menuHeading meta-serif-book-italic">Code</div>
				Download the code from <a href="https://github.com/sosolimited/semantic_sabotage" target="_blank">GitHub</a> and create your own. Start with one of the templates or with an existing transform.
				<br>
				<br>
				<a href="https://github.com/sosolimited/semantic_sabotage" target="_blank">
					<span class="modeName proxima-nova-400 whiteOnGray">Source code</span>
				</a>
				<div id="templateHeading" class="menuHeading meta-serif-book-italic">Templates</div>
				<ul id="templates"></ul>
			</div>
		</div>		

		<div id="modes">
		</div>

	<script src="LIWC/LIWC.js"></script>

	<!-- google yt api stuff -->
	<script src="http://www.google.com/jsapi" type="text/javascript"></script>
	<script src="js/embed.js" type="text/javascript"></script>

	<script src="js/libs/jquery.form.js"></script>
	<script src="js/libs/jquery.history.js"></script>
	<script src="js/libs/piecon-custom.js"></script>
	<script src="js/libs/localstoragedb.min.js"></script>
	<script src="js/statsHandler.js"></script>
	<script src="js/libs/fullscreen.js"></script>
	<script src="js/parser.js"></script>
	<script src="js/player.js"></script>
	<script src="js/sabotage.js"></script>

	<script type="text/javascript"> 
		$(document).ready(function() {
			// Check browser type
			checkBrowser();
			// Initialize the app
			init();
		});
	</script>

	<script type="text/javascript">
		<?php include 'php/fills_js.php'; ?>
	</script>

	</body>
</html>