var mode = function(id) {

	return {
	
		name: "Big Words",
		defaultURL: "http://www.youtube.com/watch?v=mox4InKEwgU",
		//el: $('<div class="modeContainer" id="'+this.name+'"></div>'),
		el: $('<div class="modeContainer" id="'+id+'"></div>'),		
				 		
								
		lineHeight: 210,
																

		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append("<div id='bigwords' class='container'></div>");
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			$('#bigwords').empty();
		},


		// Handle incoming word message.
		handleWord: function(msg) {
			//console.log('word '+msg.word);
			this.appendWordInContext(msg);
		},
		
		// Handle incoming sentenceEnd message.
		handleSentenceEnd: function(msg) {
			console.log('sentenceEnd');	
		},
		
		// Handle incoming stats message.
		handleStats: function(msg) {
			console.log(msg);
		},
		
		appendWordInContext: function(msg) {
		
		 	// update curSentence
		 	if (!msg.sentenceStartFlag && !msg.punctuationFlag)
		 		this.el.append(' ');
		 	
		 	
		 	if(msg.word.length > 8) {
		 		var e = $('<div class= "bigText proxima-nova-700" style="color:white; opacity:0;">' + msg.word + '</div>');
			 	$('#bigwords').prepend(e);

			 	setTimeout(function(element){
			 		element.css("opacity", "1");	
			 	},20,e);

			 	var h = this.lineHeight;
		 		$('#bigwords').children().each(function(i){
			 		var t = h*i+"px";
			 		//console.log("i="+i+", t="+t);
			 		$(this).css("top", t);
		 		});
		 		//console.log($('#bigwords > .bigText').length*this.lineHeight+"px");

		 		$('#bigwords').css('height', $('#bigwords > .bigText').length*this.lineHeight+"px");
		 	}		 	
		},


	}
};