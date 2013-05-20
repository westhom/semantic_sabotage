var mode = function(id) {

	return {
	
		name: "Tagged Transcript",
		defaultURL: "http://www.youtube.com/watch?v=1yD8PzFFNFU",
		//el: $('<div class="modeContainer" id="'+this.name+'"></div>'),
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		lastLeadPunct: 0,
		lastEndPunct: 0,
				 
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
			//console.log('sentenceEnd');	
		},
		
		// Handle incoming stats message.
		handleStats: function(msg) {
			//console.log(msg);
		},

		htmlEncode: function(value){
  			//create a in-memory div, set it's inner text(which jQuery automatically encodes)
  			//then grab the encoded contents back out.  The div never exists on the page.
  			return $('<div/>').text(value).html();
		},
		
		appendWordInContext: function(msg) {

			var c;
		 	if($.inArray('posemo', msg.cats) >= 0) c = '"blue"';
		 	else if($.inArray('negemo', msg.cats) >= 0) c = '"orange"';
		 	else if($.inArray('certain', msg.cats) >= 0) c = '"green"';
		 	else if($.inArray('tentat', msg.cats) >= 0) c = '"yellow"';
		 	else c = '"black"';
		 	
		 	//console.log(msg.word);
		 	var word = this.htmlEncode(msg.word);
		 	//console.log(word);
		 	
		 	// end punct always followed by space
		 	if($.inArray('endPunct', msg.cats) >= 0){
				$('#jro').append('<span class="black">' + word + ' ' + '</span>');
				this.lastLeadPunct = 0;
				this.lastEndPunct = 1;
		 	}
		 	// lead punct
		 	else if ($.inArray('leadPunct', msg.cats) >= 0){
		 		//no lead space if it follows a sentence end
		 		if (this.lastEndPunct) $('#jro').append('<span class="black">' + word + '</span>');
		 		else $('#jro').append('<span class="black">' + ' ' + word + '</span>');
		 		this.lastLeadPunct = 1;
		 		this.lastEndPunct = 0;
			}
			// words get a preceeding space, unless they follow lead punct
		 	else {	
		 		if (!this.lastLeadPunct) $('#jro').append('<span class=' + c + '>' + ' ' + word + '</span>');
		 		else $('#jro').append('<span class=' + c + '>' + word + '</span>');
		 		this.lastLeadPunct = 0;
		 		this.lastEndPunct = 0;
		 	}
		 	
		 	
		}
	}
};