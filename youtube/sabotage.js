var player = Player(this);
var embedUrl;
var video;


function load(resp) {
	console.log("load");

  console.log(resp.url);
  console.log(resp.cc);

  for (var i=0; i<resp.fills.length; i++) {
		console.log(resp.fills[i]);  
	  $.getScript("fills/"+resp.fills[i], function(data, textStatus, jqxhr) {
	   //console.log(data); //data returned
	   console.log(textStatus + ' ' + jqxhr.status); //200
		});
		
  }
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












