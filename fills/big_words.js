var mode = function(id) {

	return {
	
		name: "Big Words",
		defaultURL: "http://www.youtube.com/watch?v=mox4InKEwgU&t=0m5s",
		//el: $('<div class="modeContainer" id="'+this.name+'"></div>'),
		el: $('<div class="modeContainer" id="'+id+'"></div>'),		
				 		
								
		lineHeight: 210,
																

		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			// Insert the container.
			this.el.append("<div id='bigwords' class='container'></div>");
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			// Empty the container out each time we enter the mode.
			$('#bigwords').empty();
		},

		// Handle incoming word message.
		handleWord: function(msg) {
			//console.log('word '+msg.word);
			this.appendWordInContext(msg);
		},
		
		// Handle incoming sentenceEnd message.
		handleSentenceEnd: function(msg) {
			//console.log('sentenceEnd');	
		},
		
		// Handle incoming stats message.
		handleStats: function(msg) {
			//console.log(msg);
		},
		
		appendWordInContext: function(msg) {
		
		 	// Only show words with more than eight letters.
		 	if(msg.word.length > 8) {
		 		// Create a div for the word
		 		var e = $('<div class= "bigText proxima-nova-700" style="color:white; opacity:0;">' + msg.word + '</div>');
		 		// And stick it at the beginning of the container
			 	$('#bigwords').prepend(e);

			 	// Use setTimeout is wait until the element has been added to the DOM
			 	// before fading it in.
			 	setTimeout(function(element){
			 		element.css("opacity", "1");	
			 	},20,e);

			 	// When each new word is added, go through all the words and lay them out.
			 	// Since there is a CSS transition on 'top', they will smoothly animate down.
			 	var h = this.lineHeight;
		 		$('#bigwords').children().each(function(i){
			 		var t = h*i+"px";
			 		$(this).css("top", t);
		 		});
		 		//console.log($('#bigwords > .bigText').length*this.lineHeight+"px");

		 		$('#bigwords').css('height', $('#bigwords > .bigText').length*this.lineHeight+"px");
		 	}		 	
		},


	}
};