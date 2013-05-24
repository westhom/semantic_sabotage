var Player = function(app) {
	
	var playbackTimeoutEvents = [];	 		// Used for playing back blocks of messages.
	var parseTimeoutEvents = [];				// Used for tracking message parsing with progress bar.
	var messages = [];
	var db = new localStorageDB("db", localStorage);;
	var parser = Parser();
	parser.setup(db, messages);
	var curMessage = 0;
	
	// NOTE USE THIS TO EMPTY CACHED_MESSAGES
	//db.truncate("cached_messages");

	return {
		initialize: function(data) {
			// parser gets created, loads LIWC stuff, then calls createMessages
			parser.initialize(this.createMessages, data);
		},
	
		createMessages: function(data) {
			var ytID = data.youtube_id;
			var cc = data.cc;

			//console.log("load msgs "+cc);
			
			// check if messages exist in cache
			var res = db.query("cached_messages", {ytID: ytID});
			console.log(res);
			if (res && res.length > 0) {
				console.log("cached messages found");
				messages = res[0]['messages'];
				//app.start();
				// Give youTube movie time to cue before playing.
				// PEND Using a setTimeout is hackey. Do this right.	 	
				setTimeout(function(){
					app.start();
				}, 100);
			} else {
				console.log("creating messages");
				// Delete previously cached messages.
		  	db.truncate("cached_messages");
  			db.truncate("word_instances");
		  	// Clear the message array. 
		  	messages.length = 0;

				var offset = 40;	// Milliseconds between line parses.			
				for (var i=0; i<cc.length; i++) {
					// Gotta use offset setTimeouts, so progress bar reflow can happen.
					parseTimeoutEvents.push(setTimeout(function(data, i){
						parser.parseLine(data[i]);
						$('#progressBar').width((i/data.length)*100 + "%");		
					}, i*offset, cc, i));
				}
				
				// Once all messages are created, start!
				parseTimeoutEvents.push(setTimeout(function(){
					parser.cacheMessages(data.youtube_id);
					messages = parser.messages; // LM why is this necessary?
					app.start();
					console.log(messages);
				}, cc.length*offset + 500));

			}
			// Reset curMessage index for playback.
			curMessage = 0;
		},

    //___________________________________________________________________________________________
    // Playback a block of messages using setTimeouts 
    // Start with start message and play up and including end message.
    playMessageBlock : function(start, end) {
    
     	if(start>=0 && start<messages.length &&
     	   		end>=0 && end<messages.length){ 	
	      	
	        for(var i=start; i<=end; i++){
	        	playbackTimeoutEvents.push(setTimeout(app.handleMessage, messages[i].time-messages[start].time, messages[i]));
	        }       
      	}
			        
  	},

    // Check current time of youTube playback and release messages.
    // Uses playbacMessageBlock above as a helper function.
    updateMessagePlayback : function() {
    	if(ytCurState == ytStates.playing) {		
    		var t = messages[curMessage].time;
    		//console.log(ytPlayer.getCurrentTime()+", curMessage= "+curMessage+", t = "+t);

    		var start = curMessage;
    		
    		while(t <= document.getElementById("ytplayer").getCurrentTime()*1000 && curMessage < (messages.length-1)) {
    			//app.handleMessage(messages[curMessage]);
    			t = messages[curMessage].time;
    			curMessage++; 
    		}
    		if(curMessage > start) this.playMessageBlock(start, curMessage-1);
    	}
    },
   
  
    pausePlaybackMessages: function() {
    	console.log("pause playback");
	    for (var i=0; i<playbackTimeoutEvents.length; i++) {
		    clearTimeout(playbackTimeoutEvents[i]);
	    }
    },

    clearParseTimers: function() {
    	for (var i=0; i<parseTimeoutEvents.length; i++) {
		    clearTimeout(parseTimeoutEvents[i]);
	    }
    },

    resetPlaybackMessages: function() {
    	curMessage = 0;
    }

	};

};