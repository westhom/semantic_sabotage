var Player = function(app) {
	
	var setTimeoutEvents = [];
	var messages = [];
	var parser = Parser(messages);
	var curMessage = 0;
	
	return {
		initialize: function(cc) {
			// parser gets created, loads LIWC stuff, then calls createMessages
			parser.initialize(this.createMessages, cc);
		},
	
		createMessages: function(cc) {
			console.log("load msgs "+cc);
			
			var offset = 40;	// Milliseconds between line parses.			
			for (var i=0; i<cc.length; i++) {
				// Gotta use offset setTimeouts, so progress bar reflow can happen.
				setTimeout(function(data, i){
					parser.parseLine(data[i]);
					$('#progressBar').width((i/data.length)*100 + "%");		
				}, i*offset, cc, i);

				//parser.parseLine(cc[i]);
			}
			
			// Once all messages are created, start!
			setTimeout(function(){
				app.start();
			}, cc.length*offset + 500);
			
		},
		
		printMessages: function() {
			for (var i=0; i<messages.length; i++) {
				console.log(i+" "+messages[i]);
			}
		},
		
		
		/* // DEPRECATED.
		playbackMessages: function() {
    	
    	console.log("playback messages ");
  		var startMsg = messages[curMessage];

      	function runMessage(i) {
      
	      	//console.log("runmsg "+i);
	        curMessage = i+1;
	      
	        var msg = messages[i];
	      	app.handleMessage(msg);
	        
	        var lastMsg = (i == 0) ? startMsg : messages[i-1];

	        //console.log("last msg "+lastMsg+" msg "+msg);
	  		diff = Math.max(0, msg.time - lastMsg.time);
	  			
	      	//console.log("diff "+diff);
	        //if (app.modifier) {
	        //  diff = diff / app.modifier;
	        //}
	        
	  		setTimeoutEvents.push(setTimeout(function() {
	  				// trigger app.trigger("message:" + msg['type'], { msg: msg['attributes'] });

	          if (messages.length > i+1) {
	            runMessage(i+1);
	          } else console.log("end of msgs");
	        }, diff, this));
	  			//console.log("settimeout "+msg.word+" "+diff);
		  		
      	}	

	      //Wait until time of first message to start messages.
	      //console.log('time of first message is ' + messages[curMessage].time + '............');
	      setTimeout(runMessage, messages[curMessage].time, curMessage);
	      //runMessage(curMessage);
	    },
		*/

	    //___________________________________________________________________________________________
	    // Playback a block of messages using setTimeouts 
	    // Start with start message and play up and including end message.
	    playMessageBlock : function(start, end) {
      
	     	if(start>=0 && start<messages.length &&
	     	   		end>=0 && end<messages.length){ 	
		      	
		        for(var i=start; i<=end; i++){
		        	setTimeoutEvents.push(setTimeout(app.handleMessage, messages[i].time-messages[start].time, messages[i]));
		        }       
	      	}
				        
	  	},

	    // Check current time of youTube playback and release messages.
	    // Uses playbacMessageBlock above as a helper function.
	    updateMessagePlayback : function() {
	    	if(ytCurState == ytStates.playing) {	    		
	    		var t = messages[curMessage].time;
	    		console.log(ytPlayer.getCurrentTime()+", curMessage= "+curMessage+", t = "+t);

	    		var start = curMessage;
	    		while(t <= ytPlayer.getCurrentTime()*1000 && curMessage < (messages.length-1)) {
	    			//app.handleMessage(messages[curMessage]);
	    			t = messages[curMessage].time;
	    			curMessage++; 
	    		}
	    		if(curMessage > start) this.playMessageBlock(start, curMessage-1);
	    	}
	    },

	   

    
    pausePlaybackMessages: function() {
    	console.log("pause playback");
	    for (var i=0; i<setTimeoutEvents.length; i++) {
		    clearTimeout(setTimeoutEvents[i]);
	    }
    }
    
	};

};