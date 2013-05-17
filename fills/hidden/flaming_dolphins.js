var mode = function(id) {

	return {
	
		name: "Flaming Dolphins",
		defaultURL: "http://www.youtube.com/watch?v=UDOV8AYyyA8",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append('<div id="dolphin_disk"></div>')
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
				$('#dolphin_disk').append(' ');

			var s = document.createElement('span');
			$(s).append(msg.word);
			$(s).addClass('base proxima-nova-400');

			if ($.inArray('funct', msg.cats) >= 0) {
			/*	$(s).removeClass('base');
				$(s).addClass('basehidden');
			*/	var t = document.createElement('span');
				$(t).append(msg.word);
				$(t).addClass('funct');
				$(s).append(t);
			}



			/*
			var t = document.createElement('span');
			t.innerHTML = msg.word;
			$(t).addClass('hidden proxima-nova-400');
			$(s).append(t);

			if ($.inArray('funct', msg.cats) >= 0) {
				$(t).removeClass('hidden proxima-nova-400');
				$(s).addClass('funct proxima-nova-700');
			}
			else 
				*/

			$('#dolphin_disk').append(s);

		}
	}
};