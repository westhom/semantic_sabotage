var mode = function(id) {

	return {
	
		name: "Textfall",
		defaultURL: "http://www.youtube.com/watch?v=l26Uq3PX-fk",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append('<div id="tf_container"></div>');
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
			//console.log('sentenceEnd');	
		},
		
		// Handle incoming stats message.
		handleStats: function(msg) {
			//console.log(msg);
		},
		
		appendWordInContext: function(msg) {
		
		 	// update curSentence

			var r = document.createElement('div');
			$(r).append(msg.word);
			$(r).addClass('dimmer proxima-nova-400');
			$('#tf_container').append(r);

			var s = document.createElement('div');
			$(s).append(msg.word);
			$(s).addClass('faller proxima-nova-400');
			$('#tf_container').append(s);

		}
	}
};