var player = Player(this);
var embedUrl;
var video;

// youtube listening methods
function onYouTubePlayerReady(playerId) {
	console.log("yt loaded");
    var currentVideo = document.getElementById("movie_player");
    currentVideo.addEventListener("onStateChange", "onytplayerStateChange");
    currentVideo.pauseVideo();
    load(document.URL);
}


function onytplayerStateChange(newState) {
	console.log("state changed "+newState);
	if (newState == 1) {
		player.playbackMessages();
	} else if (newState == 2) {
		player.pausePlaybackMessages();
	}
};


function load(url) {

	console.log("load");
	player.initialize(url);

	// show loading
	//$('#loading').show();
}


function start() {
	console.log("READY TO GO!");
	// $('#loading').hide();
	// $('#playButton').show(); 
	// $('#muteButton').show();
	// $("#sourceVid").attr("src", embedUrl+'?enablejsapi=1');
	// ytplayer.cueVideoById("ci5p1OdVLAc");
	
}


function playback() {
	playVideo();
	player.playbackMessages();
}

function stopPlayback() {
	pauseVideo();
	player.stopPlaybackMessages();
}

function pausePlayback() {
	pauseVideo();
	player.pausePlaybackMessages();
}

// Handle incoming messages and distribute to appropriate functions.
function handleMessage(msg) {
	
	switch(msg.type) {
		case 'live':
			console.log('live');
			break;
		case 'word':
			handleWord(msg);
			break;
		case 'sentenceEnd':
			handleSentenceEnd(msg);
			break;
		case 'stats':
			handleStats(msg);
			break;
		default:
			break;
	}
}

