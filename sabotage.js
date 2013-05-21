var player = Player(this);
var embedUrl;
var video;

var modes = [];
var curMode = 0;
var curVideoID = '6LPaCN-_XWg';
var globalTimers = [];	// For keeping track of setTimeout events.


// Shim layer with setTimeout fallback.
window.requestAnimFrame = (function(){	
  	return	window.requestAnimationFrame       || 
           	window.webkitRequestAnimationFrame || 
           	window.mozRequestAnimationFrame    || 
           	window.oRequestAnimationFrame      || 
           	window.msRequestAnimationFrame     || 
           	function( callback ){
	           	window.setTimeout(callback, 1000 / 60);
	          };
})(); 

// This is for updating the youTube progress bar. 
(function progressLoop(){
  requestAnimFrame(progressLoop);
  updateYouTubeProgressBar();
  player.updateMessagePlayback();
})();

function init() {	
	
	// Load fills and insert them into DOM.
    loadFills();

  // Set up automatic button press on input box return key.
	$("#ytURL").keyup(function(event){
	    if(event.keyCode == 13){
	        $("#ytURLButton").click();
	    }
	});	

  // Set up aboutText div to hide after transitioning.
	$("#aboutText").on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', 
		function() {
	 		//if($(this).css('opacity') == 0) $(this).hide();	 		
	 		// Stupid hack to get it offscreen.
			if($(this).css('opacity') == 0)	$('#aboutText').css('left', '-600px');
		});
}

function loadFills() {

	// Hit fills_load PHP script.
	$.ajax({
		type: 'post',
		dataType: 'json',
   		url: "fills_load.php",
   		success: function(resp){
     		
     		var j = 0;
     		// For each fill, load javascript.
     		for (var i=0; i<resp.fills.length; i++) {
				//console.log(resp.fills[i]);  
				
				// Use function and pass in name because .getScript is asynchronous.
				(function(name) {	
					$.getScript("fills/"+resp.fills[i], function(data, textStatus, jqxhr) {
					   //console.log(data); //data returned
					   //console.log(textStatus + ' ' + jqxhr.status); //200

					   // Strip off .js and pass name to mode for element id.
					   var m = new mode(name.substr(0, name.lastIndexOf('.')));

					   modes.push(m);
					   // Add entry to menu.
					   $('#modeButtons').append('<div class="modeName" href="#" id=mode'+j+' onclick=goToMode('+j+'); >'+m.name.toUpperCase()+'</div>');
					   // Append to mode's element to DOM.
					   m.el.hide();				   
					   $('#modes').append(m.el);				   
					   // Initialize the mode.
					   m.init();

					   j++;
					});
				})(resp.fills[i]);					
			}

			
			// Load CSS for fills.
			for (var i=0; i<resp.styles.length; i++) {
				//console.log(resp.styles[i]);  
				
				$('<style type="text/css"></style>')
    			.html('@import url("fills/css/' + resp.styles[i] + '")')
    			.appendTo("head");
			}
		}
 	});
}


function load(resp) {

	console.log('load()');
	curVideoID = resp.youtube_id;

	//console.log(resp.url);
	//console.log(resp.cc);
  
	player.initialize(resp);

	//$("#sourceVid").attr("src", embedUrl+'?enablejsapi=1');
	console.log("cueVideoById( "+curVideoID+" )");
	ytplayer.cueVideoById(curVideoID);

	// show loading
	//$('#loading').show();
	
	// save embed url
	//embedUrl = resp.url.replace('watch?v=', 'embed/');
}



function start() {
	console.log("start()");
	
	// Set up nav messages and controls.
	// For a few seconds, show playing message.
	hideLoadingMessage();
	showPlayingMessage();
	// Then show controls.
	globalTimers.push(setTimeout(function(){
		showControls();
		hidePlayingMessage();
	}, 10000));
	
	playback();	
}

function goToMode(m) {
	console.log("go to mode "+m);
	if (m >= 0 && m < modes.length) {
		curMode = m;

		// Hide menu and show modes container.
		$('#menu').hide();
		$('#modes').show();

		hideAbout();

		// Hide all but the current mode's element.
		for(var i=0; i < modes.length; i++){
			if(i==curMode) modes[i].el.show();
			else modes[i].el.hide();
		}
		//console.log("URL = "+modes[curMode].defaultURL);

		// Get captions from youTube PHP, using defaultURL of mode.
		
		$.ajax({
			type: 'post',
			dataType: 'json',
			url: "youtube_load.php",
			data: {"url":modes[curMode].defaultURL},	   
	   		success: load,
	   		error: function(data){
	   			console.log(data);
	   		}
	   	});
		
		/*
		// Get captions from youTube PHP, using form.
		// Update value of input with defaultURL of mode.
		$('#ytURL').val(modes[curMode].defaultURL);
		// Ajax call below wasn't working, so for now just click submit button.
		$('#ytURLButton').click();
		*/

		// Set up nav menu.
		hideControls();
		hidePlayingMessage();
		showLoadingMessage();	
		$('#ytURL').val("Enter a different YouTube URL");		
		// Reset progress bar color to white, for loading.
		$('#progressBar').width('0%');
		$('#progressBar').css('background-color', 'white');        

		// Call enter on current mode.
		modes[curMode].enter();
	}
}

// When you submit a new URL when already inside of a mode, this does the setup.
function submitURL() {

		// Set up nav menu.
		
		hidePlayingMessage();
		showLoadingMessage();
		$('#ytURL').val("Enter a different YouTube URL");		
		// Reset progress bar color to white, for loading.
		$('#progressBar').width('0%');
		$('#progressBar').css('background-color', 'white');        

		pauseVideo();
		player.pausePlaybackMessages();
		player.resetPlaybackMessages();

		// Call enter on current mode.
		modes[curMode].enter();
}

function showMenu() {

	console.log('showMenu');

	// If menu is already visible, show information.
	if($('#about').position().left > -1800) {
		hideAbout();
	}else if($('#menu').is(':visible')) {
		//console.log('menu is shown already');
		showAbout();
	}

	$('#menu').show();
	$('#modes').hide();	

	// Reset progress bar.
	$('#progressBar').width("0%");

	

	// Stop video and message playback.
	//if(ytCurState == ytStates.playing) {
		pauseVideo();
		player.pausePlaybackMessages();
		player.resetPlaybackMessages();
		player.clearParseTimers();
	//}

	// Hide all controls.
	hideControls();
	hidePlayingMessage();
	hideLoadingMessage();
	// Stop any transitions timers.
	stopAllTimers();
}

function showAbout() {
	//console.log('showAbout()');
	$('#about').css({'left':'-1350px', 'top':'-1350px'});
	$('#aboutText').css('left', '24px');
	$('#aboutText').css('opacity','1');
	$('#aboutCover').show();
}

function hideAbout() {
	//console.log('hideAbout()');
	$('#about').css({'left':'-1800px', 'top':'-1800px'});	
	$('#aboutText').css('opacity','0');
	$('#aboutCover').hide();	
}

function showControls() {
	$('#navControls').show();
	$('#pauseButton').show();
	$('#muteButton').show();
}

function hideControls() {
	$('#navControls').hide();
}

function showLoadingMessage() { $('#loading').show(); }
function hideLoadingMessage() { $('#loading').hide(); }
function showPlayingMessage() { $('#playing').show(); }
function hidePlayingMessage() { $('#playing').hide(); }


function bodyClick() {}



function stopAllTimers() {
	for (var i=0; i<globalTimers.length; i++) {
	  clearTimeout(globalTimers[i]);
	  console.log('clear timer'+globalTimers[i]);
	}
	globalTimers = [];
}


function playback() {
	console.log('playback()');
	playVideo();
	// Note: Message playback is handled by yT state change callback.
}

function stopPlayback() {
	pauseVideo();
	// Note: Message playback is handled by yT state change callback.
}

function pausePlayback() {
	console.log('pausePlayback()');
	pauseVideo();
	// Note: Message playback is handled by yT state change callback.
}

// Handle incoming messages and distribute to appropriate functions.
function handleMessage(msg) {
	
	switch(msg.type) {
		case 'live':
			console.log('live');
			break;
		case 'word':
			modes[curMode].handleWord(msg);
			break;
		case 'sentenceEnd':
			 modes[curMode].handleSentenceEnd(msg);
			break;
		case 'stats':
			modes[curMode].handleStats(msg);
			break;
		default:
			break;
	}
}

// Handles state change messages from the yt player.
function handleYtPlayerStateChange(newState) {

	switch(newState) {
	  case -1:
			// Unstarted
			console.log('ytPlayer stage change: unstarted');
			break;
	  case 0:
			// Ended
			break;
	  case 1:
			// Playing		
			console.log('ytPlayer stage change: playing');
			$('#progressBar').css('background-color', 'red');        
			break;
	  case 2:
			// Paused
			console.log('ytPlayer stage change: paused');
			break;
	  case 3:
			// Buffering
			console.log('ytPlayer stage change: buffering');
			break;
	  case 5:
			// Video cued
			break;    
	}
		  // Keep track of yT state for everyone to reference.
	ytCurState = newState;
	//console.log('ytCurState = '+ytCurState);

	//$('#playerState').html(newState);
}


function updateYouTubeProgressBar() {
	// If movie is playing, update progress bar
	if(ytCurState == ytStates.playing){
		$('#progressBar').width((ytplayer.getCurrentTime()/ytplayer.getDuration())*100 + "%");		
	}
}







