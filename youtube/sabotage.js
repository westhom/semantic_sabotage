var player = Player(this);
var embedUrl;
var video;

function init() {
	
}

function load(resp) {
	console.log("load");

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
	$("#sourceVid").attr("src", embedUrl+'?enablejsapi=1');
	ytplayer.cueVideoById("ci5p1OdVLAc");
	
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












