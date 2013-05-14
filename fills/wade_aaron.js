var mode = function(id) {

	return {
	
		name: "Wade Aaron",
		defaultURL: "http://www.youtube.com/watch?v=UDOV8AYyyA8",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
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

		 	if (!msg.sentenceStartFlag && !msg.punctuationFlag)
				this.el.append(' ');

			var s = document.createElement('span');
			s.innerHTML = msg.word;

			if (msg.cats.length > 0) { 
				$(s).addClass('aaron proxima-nova-400');
				if ($.inArray('funct', msg.cats) >= 0) {
					$(s).removeClass('proxima-nova-400');
					$(s).addClass('funct proxima-nova-700');
				}
				if ($.inArray('verb', msg.cats) >= 0)  {
					$(s).removeClass('proxima-nova-400');
					$(s).addClass('verb proxima-nova-700');
				}
			}

			this.el.append(s);

		}
	}
};