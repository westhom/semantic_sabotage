var mode = function(id) {

	return {
	
		name: "Scrabble",
		defaultURL: "http://www.youtube.com/watch?v=mox4InKEwgU&t=0m6s",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			/* this.el.append('<div class="container"><div class="letters"> </div></div>'); */
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			//console.log(this.name+" enter()");
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

		}
};