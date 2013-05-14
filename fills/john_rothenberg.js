var mode = function(id) {

	return {
	
		name: "Type Tests",
		defaultURL: "http://www.youtube.com/watch?v=4H5ocEjhkYw",
		//el: $('<div class="modeContainer" id="'+this.name+'"></div>'),
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
				 
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append("<div id='jro' class='container bg-white museo-slab-300 size-32'></div>");
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
			$('#jro').empty();
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

			
			var c;
		 	if($.inArray('posemo', msg.cats) >= 0) c = '"blue"';
		 	else if($.inArray('negemo', msg.cats) >= 0) c = '"orange"';
		 	else if($.inArray('certain', msg.cats) >= 0) c = '"green"';
		 	else if($.inArray('tentat', msg.cats) >= 0) c = '"yellow"';
		 	else c = '"black"';
		 	
		 	console.log(c);
		
		 	// if not punct, add a space then the word
		 	if($.inArray('punct', msg.cats) < 0){
		 		//note the leading space
		 		$('#jro').append('<span class=' + c + '>' + ' ' + msg.word + '</span>');
		 	}
			
			//otherwise, just add
		 	else {
		 		$('#jro').append('<span class="black">' + msg.word + '</span>');
		 	}
		 	

		 	
		}
	}
};