var player = Player(this);
var embedUrl;
var video;

var modes = [];
var curMode = 0;
var curVideoID = '6LPaCN-_XWg';



function init() {	
	
	// Load fills and insert them into DOM.
    loadFills();

    // Set up automatic button press on input box return key.
	$("#ytURL").keyup(function(event){
	    if(event.keyCode == 13){
	        $("#ytURLButton").click();
	    }
	});

	// Hide URL form.
	$('#youtube_load').hide();
}

function loadFills() {

	$.ajax({
		type: 'post',
		dataType: 'json',
   		url: "fills_load.php",
   		success: function(resp){
     		
     		var j = 0;
     		for (var i=0; i<resp.fills.length; i++) {
				console.log(resp.fills[i]);  
				$.getScript("fills/"+resp.fills[i], function(data, textStatus, jqxhr) {
				   //console.log(data); //data returned
				   console.log(textStatus + ' ' + jqxhr.status); //200
				   var m = new mode();
				   modes.push(m);
				   // Add entry to menu.
				   $('#modeButtons').append('<div class="modeName darkGray" href="#" id=mode'+j+' onclick=goToMode('+j+'); >'+m.name.toUpperCase()+'</div>');
				   // Append to mode's element to DOM.
				   m.el.hide();
				   $('#modes').append(m.el);				   

				   j++;
				});		
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

	// show loading
	$('#loading').show();
	
	// save embed url
	//embedUrl = resp.url.replace('watch?v=', 'embed/');
}



function start() {
	console.log("READY TO GO!");
	$('#loading').hide();
	$('#playButton').show(); 
	$('#muteButton').show();
	$('#backButton').show();
	$("#sourceVid").attr("src", embedUrl+'?enablejsapi=1');

	//JRO - This should match the default video for each sketch 
	ytplayer.cueVideoById(curVideoID);
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

		// Update value of input with defaultURL of mode.
		$('#ytURL').val(modes[curMode].defaultURL);
		// Ajax call below wasn't working, so for now just click submit button.
		$('#ytURLButton').click();

		// Show URL form.
		$('#youtube_load').show();


		/*
		// Get captions from yT, using defaultURL of mode.
		$.ajax({
			type: 'post',
			dataType: 'json',
			url: "youtube_load.php",
			data: modes[curMode].defaultURL,	   		
	   		success: load
	   	});
		*/
	}
}

function showMenu() {

	$('#menu').show();
	$('#modes').hide();	

	// Reset progress bar.
	$('#progressBar').width("0%");

	// Hide URL form.
	$('#youtube_load').hide();


	// Stop video and message playback.
	pauseVideo();
	player.pausePlaybackMessages();
}

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
		player.playbackMessages();        
		break;
	  case 2:
		// Paused
		player.pausePlaybackMessages();
		break;
	  case 3:
		// Buffering
		break;
	  case 5:
		// Video cued
		break;    

	  // Keep track of yT state for everyone to reference.
	  ytCurState = newState;

	  $('#playerState').html(newState);
	}
}









