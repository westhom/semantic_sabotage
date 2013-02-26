var messagePlayer = function() {
	
	return {
		loadMessages: function() {
			console.log("load msgs");
		},
		
		startPlayback: function(transcriptID) {
			console.log("start playback");
		}, 
		
		sendMessage: function(msg) {
			console.log("send msg");
		}
	};


};