var player = Player(this);
var embedUrl;
var video;

var modes = [];
var curMode = 0;

function load(resp) {
	console.log("load");

  console.log(resp.url);
  console.log(resp.cc);
  
  $('#modeButtons').empty();
  
  var j = 0;
  
  for (var i=0; i<resp.fills.length; i++) {
		console.log(resp.fills[i]);  
	  $.getScript("fills/"+resp.fills[i], function(data, textStatus, jqxhr) {
	   //console.log(data); //data returned
	   console.log(textStatus + ' ' + jqxhr.status); //200
	   var m = new mode();
	   modes.push(m);
	   $('#modeButtons').append('<button id=mode'+j+' onclick=goToMode('+j+'); >'+m.name+'</button>');
	   j++;
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
	ytplayer.cueVideoById("mox4InKEwgU");
	
}

function goToMode(m) {
	console.log("go to mode "+m);
	if (m >= 0 && m < modes.length) {
		curMode = m;
	}
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












