var mode = function(id) {

	return {
	
		name: "Shatter (------------progress)",
		defaultURL: "http://www.youtube.com/watch?v=mox4InKEwgU",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append('<div id="shatContainer"></div>');
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
		},

		// Handle incoming word message.
		handleWord: function(msg) {
			console.log('word '+msg.word);
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
//		if (!msg.sentenceStartFlag && !msg.punctuationFlag) $('#shatContainer').append(' ');
			
			var m = document.createElement('div');
			$(m).addClass('morter proxima-nova-400');

			for (var i = 0; i < msg.word.length; i++) {
				var a = document.createElement('span');
				console.log(a);
				$(a).append(msg.word[i]);
				$(m).append(a);
			};


		 	$('#shatContainer').append(m);
			
			window.getComputedStyle(m).WebkitTransform;

			$(m).css('-webkit-transform', 'translateZ(0px) scale(0.05)');
			$(m).css('color', 'black');

		}
	}
};