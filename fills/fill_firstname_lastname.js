var mode = function() {

	return {
	
		name: "Empty Mode",
		defaultURL: "http://www.youtube.com/watch?v=ci5p1OdVLAc",
		el: $('<div class="modeContainer" id="'+this.name+'"></div>'),
		
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
		 		
		 	this.el.append(msg.word);
		}
	}
};