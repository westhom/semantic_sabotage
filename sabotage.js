var player = Player(this);
var embedUrl;
var video;

var modes = [];
var curMode = 0;
var curVideoID = 'ci5p1OdVLAc';


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
				console.log(resp.fills[i]);  
				
				// Use function and pass in name because .getScript is asynchronous.
				(function(name) {	
					$.getScript("fills/"+resp.fills[i], function(data, textStatus, jqxhr) {
					   //console.log(data); //data returned
					   //console.log(textStatus + ' ' + jqxhr.status); //200

					   // Strip off .js and pass name to mode for element id.
					   var m = new mode(name.substr(0, name.lastIndexOf('.')));

					   modes.push(m);
					   // Add entry to menu.
					   $('#modeButtons').append('<div class="modeName darkGray" href="#" id=mode'+j+' onclick=goToMode('+j+'); >'+m.name.toUpperCase()+'</div>');
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

	console.log(resp.youtube_id);
	curVideoID = resp.youtube_id;

	console.log(resp.url);
	console.log(resp.cc);
  
	player.initialize(resp.cc);

	$("#sourceVid").attr("src", embedUrl+'?enablejsapi=1');
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
	setTimeout(function(){
		showControls();
		hidePlayingMessage();
	}, 10000);
	
	playback();	
}

function goToMode(m) {
	console.log("go to mode "+m);
	if (m >= 0 && m < modes.length) {
		curMode = m;

		// Hide menu and show modes container.
		$('#menu').hide();
		$('#modes').show();

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
	
		// Set up nav menu.
		showLoadingMessage();
		$('#ytURL').val("Enter a different YouTube URL");		
		// Reset progress bar color to white, for loading.
		$('#progressBar').width('0%');
		$('#progressBar').css('background-color', 'white');        

		// Call enter on current mode.
		modes[curMode].enter();
	}
}

function showMenu() {

	$('#menu').show();
	$('#modes').hide();	

	// Reset progress bar.
	$('#progressBar').width("0%");

	// Hide all controls.
	hideControls();

	// Stop video and message playback.
	pauseVideo();
	player.pausePlaybackMessages();
}

function showControls() {
	$('#navControls').show();
}

function hideControls() {
	$('#navControls').hide();
}

function showLoadingMessage() { $('#loading').show(); }
function hideLoadingMessage() { $('#loading').hide(); }
function showPlayingMessage() { $('#playing').show(); }
function hidePlayingMessage() { $('#playing').hide(); }




function playback() {
	playVideo();
	//player.playbackMessages();	// Now handled by yT state change callback.
}

function stopPlayback() {
	pauseVideo();
	//player.stopPlaybackMessages();	// Doesn't exist yet, but anyway, handled by yT state change callback.
}

function pausePlayback() {
	pauseVideo();
	//player.pausePlaybackMessages();  // Now handled by yT state change callback.
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
		break;
	  case 0:
		// Ended
		break;
	  case 1:
		// Playing
		//player.playbackMessages();
		$('#progressBar').css('background-color', 'red');        
		break;
	  case 2:
		// Paused
		//player.pausePlaybackMessages();
		break;
	  case 3:
		// Buffering
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







