// Define a local copy of History (used for ajax page states)
var History = window.History;
// If history state is popped by the user hitting the back or forward button, refresh the page
window.onpopstate = function(e) {
	if (e && e.state) location.reload();
}

// The player handles the playback of YouTube captions
var player = Player(this);

var embedUrl;
var video;
var modes = [];
var curMode = 0;
var curVideoID;
var globalTimers = [];	// For keeping track of setTimeout events.

// Set up piechart favicon for loading captions
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

// Updates the YouTube progress bar.
(function progressLoop(){
	requestAnimFrame(progressLoop);
	updateYouTubeProgressBar();
	player.updateMessagePlayback();
})();

// On page load
function init() {

	// bind submit URL form to callback
	$('#youtube_load').ajaxForm({ 
		dataType:  'json', 
		success:   load 
		});

	// Bind hover event to icon highlight
	$('.navBar').on('mouseenter','.icon',function(){
		var type = $(this).data('icon');
		$(this).attr('src', 'img/icons/hover_'+type+'.png');
	}).on('mouseleave','.icon',function(){
		var type = $(this).data('icon');
		$(this).attr('src', 'img/icons/'+type+'.png');
	});
	
	// Load fills
	loadFills();
	
	// Wait for fills to load before inserting them into the DOM
	$(document).on('loadedFills', function(e, modes) {
		// Add menu element for each fill
		drawFills(modes);
		// Redirect to mode if specified in URL
		checkURL();
	});
}

// Parse URL and redirect to a specific mode if necessary
function checkURL() {
	var slug = getParameterByName('m');
	var video = getParameterByName('id');
	var time = getParameterByName('time');
	// full youtube URL
	var url = buildURLFromID(video);

	if (slug != null) {
		// look up mode index from array of all fills
		var mode = modeFromSlug(slug, modes);
		if (mode >= 0) {
			if (video != null) {
				if (time != null) {
					// If video and time are both defined
					goToMode(mode, true, url, time)
				} else {
					// If only video is defined
					goToMode(mode, true, url);
				}
			} else {
				// If only a mode is defined and no video
				goToMode(mode);
			}
		}
	}

}

// Load fills from directory into `modes` object
function loadFills() {

	// Get fill filenames from fills_load.php
	$.ajax({
		type: 'get',
		dataType: 'json',
			url: "php/fills_load.php",
			success: function(resp){
				var fills = resp.fills;

				// need separate iterator for async calls
				var j = 0;
				// For each fill, load javascript.
				for (var i=0; i<fills.length; i++) {				
					// Use anonymous function and pass in filename because
					// .getScript is asynchronous
					(function(name) {	
						$.getScript("fills/"+fills[i], function(data, textStatus, jqxhr) {
							
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
					$('<style type="text/css"></style>')
						.html('@import url("fills/css/' + resp.styles[i] + '")')
						.appendTo("head");
				}
			}
	});
}

// Insert a DOM element in the menu for each mode
function drawFills(modes) {
	// Sort alphebetically
	modes = modes.sort(function(a,b){
		if (a.name.toLowerCase() == b.name.toLowerCase()) return 0;
		return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1:-1;
	});
	$.each(modes, function(i,m){
		var color = (m.template==true) ? 'whiteOnGray' : 'blackOnWhite';
		var section = (m.template==true) ? '#templates' : '#transforms';
		var title = m.name+' | Semantic Sabotage'
		var modeHTML = '<li><span class="modeName proxima-nova-400 '+color+'" href="#" id="mode'+i+'" onclick="linkToMode('+i+',\''+title+'\');" >'+m.name+'</span></li>'
		// Append mode menu item to DOM
		$(section).append(modeHTML);
		// Append hidden mode container to DOM.
		m.el.hide();				   
		$('#modes').append(m.el);
		// Initialize the mode.
		m.init();
	});
}

// After clicking a menu link, should push new URL state before switching to mode
// Wrapper for goToMode
function linkToMode(m, title) {
	History.pushState(null, null, buildStateFromArguments(m));
	document.title = title;
	goToMode(m, true);
}

// Jumps to a mode
// `m` mode index
// `fullSetup` (optional) if true, loads captions from youtube
// `video` and `time` are optional; used only when switching to a mode
// directly from the URL
function goToMode(m, fullSetup, video, time) {
	console.log("Loading mode: ", modes[m].name);
	if (m >= 0 && m < modes.length) {
		curMode = m;

		// Hide menu and show modes container.
		$('#menu').hide();
		turnOffAnimations();
		$('#modes').show();


		// Hide all but the current mode's element.
		for(var i=0; i < modes.length; i++){
			if(i==curMode) modes[i].el.show();
			else modes[i].el.hide();
		}

		// If fullSetup arg is not defined, default to true.
		fullSetup = (typeof fullSetup == 'undefined')? true : fullSetup;

		if(fullSetup){
			video = (typeof video == 'undefined')? modes[curMode].defaultURL : video;

			if (typeof time == 'undefined') {
				modes[curMode].startTime = getStartTimeFromURL(video);
			} else {
				modes[curMode].startTime = time;
			}

			// Get captions from youtube_load.php
			// console.log('Fetching captions for URL ', video);
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

			// Only set submit field if posting. 
			$('#ytURL').val("Enter a different YouTube URL");		

		} else {
			// Full reset of player before changing video
			pauseVideo();
			player.pausePlaybackMessages();
			player.resetPlaybackMessages();
			player.clearParseTimers();
		}

		// Set up nav menu
		showControls();
		hideSubmit();
		hidePlayingMessage();
		showLoadingMessage();
		// Reset progress bar color to white, for loading.
		$('#progressBar').width('0%');
		$('#progressBar').css('background-color', 'white');        

		// Call enter on current mode.
		modes[curMode].enter();
	}
}

// Load messages player and cue YouTube embedded player
// `resp` is the response from POSTing to youtube_load.php
// it contains the full captions for the current video
function load(resp) {
	// console.log('Captions fetched successfully');

	// Cancel loading if user has returned to the menu early
	if ($('#menu').is(":visible")) return false;

	curVideoID = resp.youtube_id;
	
	player.initialize(resp);
	
	if(typeof modes[curMode]["startTime"] == "undefined")
		modes[curMode]["startTime"] = 0;

	// console.log( "Starting player at: " + modes[curMode]["startTime"] + " seconds");
	ytplayer.cueVideoById(curVideoID, modes[curMode]["startTime"]);
}

// Begin playback
function start() {
	
	// Set up nav messages and controls.
	// For a few seconds, show playing message.
	hideLoadingMessage();
	showPlayingMessage();
	// Then show controls.
	globalTimers.push(setTimeout(function(){
		showSubmit();
		hidePlayingMessage();
	}, 5000));
	
	playback();	
}

// Setup a new YouTube URL, submitting in a mode from the navbar field
function submitURL() {
	var url = $('#ytURL').val().trim();
	var id = getIDFromURL(url);

	if (id == -1) {
		$('#ytURL').val('Bad link. Please try again...');
		return false;
	}

	var time = getStartTimeFromURL(url);

	// console.log('URL submitted: ', url);

	// Update URL with new video id
	History.pushState(null, null, buildStateFromArguments(curMode, id, time));
	
	// Re-initialize mode, but don't do fetch titles from goToMode
	goToMode(curMode, false);

	// See if URL has a t=#m#s parameter to set the start time
	modes[curMode].startTime = time;

	// Load new YouTube captions
	// console.log('Fetching captions for URL ', video);
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

	// Reset URL to root
	History.pushState(null, null, '?');
	document.title = 'Semantic Sabotage'
	
	$('#menu').show();
	$('#menu').scrollTop('0px');
	$('#modes').hide();	

	// Reset progress bar
	$('#progressBar').width("0%");
	Piecon.reset();

	pauseVideo();
	player.pausePlaybackMessages();
	player.resetPlaybackMessages();
	player.clearParseTimers();

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

function hideSubmit() {
	$('#ytURL').hide();
}

function showSubmit() {
	$('#ytURL').show();
}

function showLoadingMessage() {
	$('#loading').show();
}

function hideLoadingMessage() {
	$('#loading').hide();
}

function showPlayingMessage() {
	$('#playing').show();
}

function hidePlayingMessage() {
	$('#playing').hide();
}


function bodyClick() {
}

// Iterate through the globalTimers object and clear timeouts
function stopAllTimers() {
	for (var i=0; i<globalTimers.length; i++) {
		clearTimeout(globalTimers[i]);
	}
	globalTimers = [];
}

// Trigger playVideo() in embed.js
function playback() {
	playVideo();
	// Note: Message playback is handled by yT state change callback.
}

function pausePlayback() {
	pauseVideo();
	// Note: Message playback is handled by yT state change callback.
}

// Handle incoming messages and distribute to appropriate functions.
function handleMessage(msg) {
	// Make sure this message isn't stale (because the user has switched to another tab)
	var stale_message_threshold = 1000;
	if(document.getElementById("ytplayer").getCurrentTime()*1000 - msg["time"] > stale_message_threshold) {
		return false;
	}

	switch(msg.type) {
		case 'live':
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
}

function getCategoryIndex(category) {
  var i = 0;
  for (var cat in LIWC_cats) {
      if (cat == category)
      	return i;
      else i++;
  }
  return -1;
}

function getCategoryFullName(category) {
	var name = LIWC_cats[category];
	if (name) return name;
	else return category;
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
		// Update icon
		$("#fullscreenButton").html('<img src="img/icons/fullscreen.png" class="icon" data-icon="fullscreen">');
	}
	else{
		fullScreenApi.requestFullScreen(document.getElementsByTagName("body")[0]);
		// Update icon
		$("#fullscreenButton").html('<img src="img/icons/normalscreen.png" class="icon" data-icon="normalscreen">');
	}
}

// Helper function to conver mode names to URL friendly slugs
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

// Retrieve parameters by `name` from a URL
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Retrieve the mode index of the `slug` from the `modes` object
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
