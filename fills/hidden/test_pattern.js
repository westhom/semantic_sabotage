var mode = function(id) {

	return {
	
		name: "Test Pattern (corner blocks)",
		defaultURL: "http://www.youtube.com/watch?v=mox4InKEwgU",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {

			var c = document.createElement('div');
			$(c).addClass('container');

			this.el.append(c);

			for (var i = 0; i < 4; i++) {
				var b = document.createElement('div');
				$(b).addClass('box box'+(i+1));
				$('#test_pattern .container').append(b);

			}
			 
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
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
		
		 	// update curSentence
		}
	}
};