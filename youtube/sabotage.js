var player = Player(this);
var embedUrl;

function init() {
	
}

function load(resp) {

  console.log(resp.url);
  
	console.log("load");
	var config = JSON && JSON.parse(configJSON) || $.parseJSON(configJSON);
	//console.log(config);
	
	player.initialize(resp.url);

	// show loading
	$('#loading').show();
	
	// save embed url
	embedUrl = resp.url.replace('watch?v=', 'embed/');
}

function start() {
	console.log("READY TO GO!");
	$('#loading').hide();
	$('#playButton').show();
	$('#stopButton').show();
	$('#video').html('<iframe width="560" height="315" src="'+embedUrl+'" frameborder="0" allowfullscreen></iframe>');
	
}

function playback() {
	player.playbackMessages();
}

function stopPlayback() {
	player.stopPlaybackMessages();
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












