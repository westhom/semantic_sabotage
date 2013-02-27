var messagePlayer = function() {
	
	var setTimeoutEvents = [];
	var obj;
	
	return {
		loadMessages: function() {
			console.log("load msgs");
			obj = JSON && JSON.parse(messagesJSON) || $.parseJSON(messagesJSON);
			console.log(obj['messages'].length);
			
		},
		
		sendMessage: function(msg) {
			console.log("send msg");
		},
		
		
		playbackMessages: function(transcriptID) {
    	
    	console.log("playback messages "+transcriptID);
    	var n = 0;
  		var startMsg = obj['messages'][0];

      function runMessage(i) {
      
      	console.log("runmsg "+i);
      
        var msg = obj['messages'][i];
        
        var lastMsg = (i == 0) ? startMsg : obj['messages'][i-1];

  			diff = Math.max(0, msg.timeDiff - lastMsg.timeDiff);
  			

      	console.log("diff "+diff);
        //if (app.modifier) {
        //  diff = diff / app.modifier;
        //}
  			if (diff >= 0) {
	  			setTimeoutEvents.push(setTimeout(function() {
	  				// trigger app.trigger("message:" + msg['type'], { msg: msg['attributes'] });

            //if (obj['messages'].length >= i+1) {
              runMessage(i+1);
            //}
          }, diff, this));
	  			console.log("settimeout "+msg["word"]+" "+diff);
	  		}
      }

      runMessage(0);

  		//this.each( function(msg) {
  		//	diff = diff || msg.get("timeDiff") - startMsg.get("timeDiff");
  		//	if (diff >= 0) {
	  	//		setTimeoutEvents.push(setTimeout(function() {
      //      app.trigger("message:" + msg.get("type"), { msg: msg.attributes, live: app.live });
      //    }, 1000));
	  	//		//console.log("settimeout "+msg.get("word")+" "+diff);
	  	//	}
  		//});
    }
	};


};