var mode = function(id) {

	return {
	
		name: "One Word",

		defaultURL: "http://www.youtube.com/watch?v=l-gQLqv9f4o&t=0m12s",
		//usfRtJpyJDk = how to behave in court
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		template: true,
				 

		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append('<div class="topContainer"><div id="onebyone" class="centerContainer proxima-nova-400"></div></div>');
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
			//this.el.find('.centerContainer').empty();
			$('#onebyone').empty();
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
		
			// Choose a color based on the category of the word in the LIWC Dictionary.
			// These are five very broad LIWC categories
			var c;
			if($.inArray('cogmech', msg.cats) >= 0) c = 'rgb(51,154,96)';  			//green
			else if($.inArray('social', msg.cats) >= 0) c = 'rgb(193,250,164)';	//light green
			else if($.inArray('affect', msg.cats) >= 0) c = 'rgb(232,218,122)'; //yellow
			else if($.inArray('percept', msg.cats) >= 0) c = 'rgb(255,161,92)'; //orange
			else if($.inArray('verb', msg.cats) >= 0) c = 'rgb(237,75,58)'; 		//red
			else c = 'rgb(240,240,240)';

			// Set the html of the div with id="word" to the new text
			$('#onebyone').html(msg.word);

			// Color the word to match
			$('#onebyone').css("color", c);

		}
	}
};