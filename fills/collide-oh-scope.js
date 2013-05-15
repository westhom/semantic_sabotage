var mode = function(id) {

	return {
	
		name: "Collide-Oh-Scope",
		defaultURL: "http://www.youtube.com/watch?v=mox4InKEwgU",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append('<div id="collider"></div>');
			$('#collider').append('<div id="marquee"></div>');
			$('#marquee').addClass('proxima-nova-400');
		},

		// Gets called evertime you go to the mode.
		enter: function() {
		},

		// Handle incoming word message.
		handleWord: function(msg) {
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

			$('#marquee').empty();
			$('#marquee').append(msg.word);

			var s = document.createElement('div');
			$(s).append(msg.word);
			$(s).addClass('morter proxima-nova-400');
			$('#collider').append(s);

		}
	}
};