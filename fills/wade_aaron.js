var mode = function(id) {

	return {
	
		name: "Wade Aaron",
		defaultURL: "http://www.youtube.com/watch?v=UDOV8AYyyA8",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		
		// Anything you want to do to initialize your mode. 
		init: function() {

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

			var s = document.createElement('span');
			s.innerHTML = msg.word;

			if (msg.cats.length > 0) { 
				$(s).addClass('aaron');
				if ($.inArray('funct', msg.cats) >= 0) $(s).addClass('funct');
				if ($.inArray('verb', msg.cats) >= 0) $(s).addClass('verb');
			}

			this.el.append(s);

		}
	}
};