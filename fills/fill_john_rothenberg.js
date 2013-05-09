var mode = function() {

	return {
	
		name: "Type Tests",
		defaultURL: "http://www.youtube.com/watch?v=mox4InKEwgU",
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
		 	
		 	var c;
		 	if($.inArray('funct', msg.cats) >= 0) c = 'rgb(255,0,0)';
		 	else if($.inArray('percept', msg.cats) >= 0) c = 'rgb(0,255,0)';
		 	else if($.inArray('heshe', msg.cats) >= 0) c = 'rgb(45,255,0)';
		 	else if($.inArray('verbs', msg.cats) >= 0) c = 'rgb(255,180,140)';
		 	else c = 'rgb(40,40,40)';

		 	this.el.html('<span class= "museo-slab-1000 size-128" style="color:' + c + ';">' + msg.word + '</span>');
		}
	}
};