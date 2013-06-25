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


(function progressLoop(){
	// Updates the YouTube progress bar.
	requestAnimFrame(progressLoop);
	updateYouTubeProgressBar();
	//Update the captioning message player object.
	player.updateMessagePlayback();
})();

// On page load
function init() {
	
	// Load mode containers and fill menu items
	drawFills();

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

	checkURL();

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

function drawFills() {
	$.each(modes, function(i,m){
		var color = m.template ? 'whiteOnGray' : 'blackOnWhite';
		var section = m.template ? '#templates' : '#transforms';
		var title = m.name+' | Semantic Sabotage';
		var $fill = $('<div class="fill"></div>');
		var modeHTML = '<li><span class="modeName proxima-nova-400 '+color+'" href="#" id="mode'+i+'" onclick="linkToMode('+i+');" >'+m.name+'</span></li>'
		$fill.html(modeHTML);
		if (!m.template) {
			var author = m.author;
			var authorHTML = '<li><span class="modeAuthor meta-serif-book-italic blackOnWhite" href="#">by '+author+'</span></li>'
			$fill.append(authorHTML);
		}
		// Append mode menu item to DOM
		$(section).append($fill[0].outerHTML);
		// Append hidden mode container to DOM.
		m.el.hide();				   
		$('#modes').append(m.el);
		// Initialize the mode.
		m.init();
	});

	// Insert extra elements in transforms UL to fix scrolling bug (hacky hacky).
	$('#templates').append('<li><span class="modeName">&nbsp;</span></li>');


}

// After clicking a menu link, should push new URL state before switching to mode
// Wrapper for goToMode
function linkToMode(m) {
	History.pushState(null, null, buildStateFromArguments(m));
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
		
		document.title = modes[curMode].name + ' | Semantic Sabotage';
		$('.navTitle').html(modes[curMode].name.toUpperCase());
		if (modes[curMode].author) {
			$('.navAuthor').html('by '+modes[curMode].author);
		}

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
	document.title = 'Semantic Sabotage';
	
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

function showBrowserMessage(mobile) {
	$('#menu').hide();
	$('#unsupported').show();	

	// Fix for funny iOS margin bug.
	if(mobile){
	 $('body').css('background-color', 'white');
	 $('#unsupported').html('Check out Semantic Sabotage in Chrome, Safari, or Firefox on a desktop or laptop.');
	}
}

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};


function checkBrowser() {
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browserName  = navigator.appName;
	var fullVersion  = ''+parseFloat(navigator.appVersion); 
	var majorVersion = parseInt(navigator.appVersion,10);
	var nameOffset,verOffset,ix;

	// In Opera, the true version is after "Opera" or after "Version"
	if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
	 browserName = "Opera";
	 fullVersion = nAgt.substring(verOffset+6);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
	 browserName = "Microsoft Internet Explorer";
	 fullVersion = nAgt.substring(verOffset+5);
	}
	// In Chrome, the true version is after "Chrome" 
	else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
	 browserName = "Chrome";
	 fullVersion = nAgt.substring(verOffset+7);
	}
	// In Safari, the true version is after "Safari" or after "Version" 
	else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
	 browserName = "Safari";
	 fullVersion = nAgt.substring(verOffset+7);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In Firefox, the true version is after "Firefox" 
	else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
	 browserName = "Firefox";
	 fullVersion = nAgt.substring(verOffset+8);
	}
	// In most other browsers, "name/version" is at the end of userAgent 
	else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
	          (verOffset=nAgt.lastIndexOf('/')) ) 
	{
	 browserName = nAgt.substring(nameOffset,verOffset);
	 fullVersion = nAgt.substring(verOffset+1);
	 if (browserName.toLowerCase()==browserName.toUpperCase()) {
	  browserName = navigator.appName;
	 }
	}
	// trim the fullVersion string at semicolon/space if present
	if ((ix=fullVersion.indexOf(";"))!=-1)
	   fullVersion=fullVersion.substring(0,ix);
	if ((ix=fullVersion.indexOf(" "))!=-1)
	   fullVersion=fullVersion.substring(0,ix);

	majorVersion = parseInt(''+fullVersion,10);
	if (isNaN(majorVersion)) {
	 fullVersion  = ''+parseFloat(navigator.appVersion); 
	 majorVersion = parseInt(navigator.appVersion,10);
	}


	if(browserName=='Chrome' || browserName=='Safari' || browserName=='Firefox'){
		// Only show not supported if we're on a mobile browser.
		if( isMobile.any() ) showBrowserMessage(true);
	}else{
		// Show the browser not supported message.
		showBrowserMessage();
	}
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
	//console.log(msg);
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
