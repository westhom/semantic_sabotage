var History = window.History;
// If history state is popped by the user hitting the back or forward button, refresh the page
window.onpopstate = function(e) {
	if (e && e.state) location.reload();
}

var player = Player(this);
var embedUrl;
var video;

var modes = [];
var curMode = 0;
var curVideoID = '6LPaCN-_XWg';
var curVideoStartTime = "";
var globalTimers = [];	// For keeping track of setTimeout events.

// Set up pie chart favicon for loading captions
Piecon.setOptions({
  color: '#fff',
  background: '#000000',
  shadow: '#333',
  fallback: 'prohibit'
});

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

		// bind 'myForm' and provide a simple callback function 
	$('#youtube_load').ajaxForm({ 
		// DataType identifies the expected content type of the server response.
		dataType:  'json', 
		// Success identifies the function to invoke when the server response has been received.
		success:   load 
		});

	$('.navBar').on('mouseenter','.icon',function(){
		var type = $(this).data('icon');
		$(this).attr('src', 'img/icons/hover_'+type+'.png');
	}).on('mouseleave','.icon',function(){
		var type = $(this).data('icon');
		$(this).attr('src', 'img/icons/'+type+'.png');
	});
	
	// Load fills and insert them into DOM.
	loadFills();
	
	// Wait for fills to load before adding the menu links to the DOM
	$(document).on('loadedFills', function(e, modes) {
		// Add menu element for each fill
		drawFills(modes);
		// Redirect straight to a mode depending on the URL
		checkURL();
	});
}

// Parses URL and redirects to a specific mode if necessary
function checkURL() {
	// mode slug
	var slug = getParameterByName('m');
	var video = getParameterByName('id');
	var time = getParameterByName('time');
	// full youtube URL
	var url = buildURLFromID(video);

	if (slug != null) {
		// mode index
		var mode = modeFromSlug(slug, modes);
		if (mode >= 0) {
			if (video != null) {
				if (time != null) {
					// If video and time are both defined
					goToMode(mode, true, url, time)
				} else {
					// If just video is defined
					goToMode(mode, true, url);
				}
			} else {
				// If only a mode is defined and no video
				goToMode(mode);
			}
		}
	}

}

function loadFills() {

	// Hit fills_load PHP script.
	$.ajax({
		type: 'post',
		dataType: 'json',
			url: "php/fills_load.php",
			success: function(resp){

				// filter the response so that only .js files are included in the array (no folders)
				var fills = $.grep(resp.fills, function(f){return f.indexOf(".js") >= 0;});
		
				var j = 0;
				// For each fill, load javascript.
				for (var i=0; i<fills.length; i++) {
				//console.log(resp.fills[i]);  
				
				// Use function and pass in name because .getScript is asynchronous.
				(function(name) {	

					$.getScript("fills/"+fills[i], function(data, textStatus, jqxhr) {

						//console.log(data); //data returned
						//console.log(textStatus + ' ' + jqxhr.status); //200

						// Strip off .js and pass name to mode for element id.
						var m = new mode(name.substr(0, name.lastIndexOf('.')));

						modes.push(m);
						j++;

						// When the last fill finishes loading, trigger the event
						if (j == fills.length) {
							$(document).trigger('loadedFills',[modes]);
						}
					});
				})(fills[i]);

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

// Insert a DOM element in the menu for each mode
function drawFills(modes) {
	modes = modes.sort(function(a,b){
		if (a.name.toLowerCase() == b.name.toLowerCase()) return 0;
		return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1:-1;
	});
	$.each(modes, function(i,m){
		// Add entry to menu.
		if(m.template==true){
			$('#templates').append('<li><span class="modeName proxima-nova-400 whiteOnGray" href="#" id="mode'+i+'"" onclick="linkToMode('+i+',\''+m.name+' | Semantic Sabotage\');" >'+m.name+'</span></li>');	
		}else{
			$('#transforms').append('<li><span class="modeName proxima-nova-400 blackOnWhite" href="#" id="mode'+i+'"" onclick="linkToMode('+i+',\''+m.name+' | Semantic Sabotage\');" >'+m.name+'</span></li>');
		}
		// Append to mode's element to DOM.
		m.el.hide();				   
		$('#modes').append(m.el);				   
		// Initialize the mode.
		m.init();
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
	if(typeof modes[curMode]["startTime"] == "undefined")
		modes[curMode]["startTime"] = 0;

	console.log( "Starting player at: " + modes[curMode]["startTime"] + " seconds");

	ytplayer.cueVideoById(curVideoID, modes[curMode]["startTime"]);
	//ytplayer.cueVideoById(curVideoID);

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

// After clicking a menu link, should push new URL state before switching to mode
function linkToMode(m, title) {
	History.pushState(null, null, buildStateFromArguments(m));
	document.title = title;
	goToMode(m);
}

// Jumps to a mode
// post optional; used only when switching to a different video from the field in the navbar
// video and time are optional; used only when switching to a mode directly from URL
function goToMode(m, post, video, time) {
	console.log("go to mode "+m);
	if (m >= 0 && m < modes.length) {
		curMode = m;

		// If post arg is not defined, default to true.
		post = (typeof post == 'undefined')?true:post;
		video = (typeof video == 'undefined')? modes[curMode].defaultURL : video;

		// Hide menu and show modes container.
		$('#menu').hide();
		turnOffAnimations();
		$('#modes').show();


		// Hide all but the current mode's element.
		for(var i=0; i < modes.length; i++){
			if(i==curMode) modes[i].el.show();
			else modes[i].el.hide();
		}
		//console.log("URL = "+modes[curMode].defaultURL);

		if(post){
			// Set start time to mode's default
			if (typeof time == 'undefined') {
				modes[curMode].startTime = getStartTimeFromURL(video);
			} else {
				modes[curMode].startTime = time;
			}

			// Get captions from youTube PHP, using defaultURL of mode.
			console.log('gotoMode - ajax post', video);
			$.ajax({
				type: 'post',
				dataType: 'json',
				url: "php/youtube_load.php",
				data: {"url": video},
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

			// Only set submit field if posting. 
			$('#ytURL').val("Enter a different YouTube URL");		

		} else {
			pauseVideo();
			player.pausePlaybackMessages();
			player.resetPlaybackMessages();
			player.clearParseTimers();
		}

		// Set up nav menu.
		hideControls();
		hidePlayingMessage();
		showLoadingMessage();	
		// Reset progress bar color to white, for loading.
		$('#progressBar').width('0%');
		$('#progressBar').css('background-color', 'white');        

		// Call enter on current mode.
		modes[curMode].enter();
	}
}

// When you submit a new URL when already inside of a mode, this does the setup.
function submitURL() {
	var url = $('#ytURL').val().trim();
	var id = getIDFromURL(url);
	if (id == -1) {
		$('#ytURL').val('Bad link. Please try again...');
		return false;
	}
	var time = getStartTimeFromURL(url);

	console.log('submitURL()');

	History.pushState(null, null, buildStateFromArguments(curMode, id, time));
	goToMode(curMode, false);

	// See if URL has a t=#m#s parameter to set the start time
	modes[curMode].startTime = time;

	// Post to youTube script with submit field value.
	console.log('About to post'+url);

	$.ajax({
		type: 'post',
		dataType: 'json',
		url: "php/youtube_load.php",
		data: {"url": url},	   
			success: load,
			error: function(data){
				$('#ytURL').val('Bad link. Please try again...');
				console.log(data);
			}
	});
}

function getStartTimeFromURL(inputURL) {
	// See if URL has a t=#m#s parameter to set the start time
	var startTimeRegExp = new RegExp("t=([0-9]+)m([0-9]+)s");
	startTimeResult = startTimeRegExp.exec(inputURL);
	if(startTimeResult && startTimeResult.length >= 3) {
		// Start time = minutes * 60 + seconds from the URL
		return parseInt(startTimeResult[1]) * 60 + parseInt(startTimeResult[2]);
	}
	else {
		return 0;
	}
}

// Return just the ID from a longer youtube URL
function getIDFromURL(inputURL) {
	var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	var match = inputURL.match(regExp);
	if (match&&match[2].length==11){
	    return match[2];
	}else{
	    return -1;
	}
}


function showMenu() {

	console.log('showMenu');

	History.pushState(null, null, '?');
	document.title = 'Semantic Sabotage'
	
	$('#menu').show();
	$('#menu').scrollTop('0px');
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
	// Make sure this message isn't stale (because the user has switched to another tab or something)
	var stale_message_threshold = 1000;
	if(document.getElementById("ytplayer").getCurrentTime()*1000 - msg["time"] > stale_message_threshold) {
		//console.log("STALE MESSAGE");
		return;
	}

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
			Piecon.reset();        
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


function toggleFullscreen() {
	if(fullScreenApi.isFullScreen()) {
		fullScreenApi.cancelFullScreen();
		$("#fullscreenButton").html('<img src="img/icons/fullscreen.png" class="icon" data-icon="fullscreen">');
	}
	else{
		fullScreenApi.requestFullScreen(document.getElementsByTagName("body")[0]);
		$("#fullscreenButton").html('<img src="img/icons/normalscreen.png" class="icon" data-icon="normalscreen">');
	}
}

function convertToSlug(text) {
	return text
			.toLowerCase()
			.replace(/[^\w ]+/g,'')
			.replace(/ +/g,'-');
}

// Builds arguments to push onto the root URL with History.js
// curMode is just the index of the mode to add to the URL
function buildStateFromArguments(curMode, id, time) {
	var mode = convertToSlug(modes[curMode].name);
	if (typeof id != 'undefined') {
		if (typeof time != 'undefined') {
			return '?m='+mode+'&id='+id+'&time='+time;
		} else {
			return '?m='+mode+'&id='+id;
		}
	} else {
		return '?m='+mode;
	}
}

function buildURLFromID(id) {
	return 'http://www.youtube.com/watch?v='+id;
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function modeFromSlug(slug, modes) {
	var mode;
	$.each(modes, function(i,m) {
		if (convertToSlug(m.name) == slug) {
			mode = i;
			return false;
		}
	});
	return (mode == null) ? -1 : mode;
}

// Turns off css animations for the menu,
// Columns should fade in only the first time the page is loaded
function turnOffAnimations() {
	$('#columnLeft, #columnRight').removeClass('delay animated');
}
