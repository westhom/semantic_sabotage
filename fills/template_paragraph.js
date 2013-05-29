var mode = function(id) {

	return {
	
		name: "Paragraph",
		defaultURL: "http://www.youtube.com/watch?v=PKffm2uI4dk",
		//el: $('<div class="modeContainer" id="'+this.name+'"></div>'),
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		template: true,
		
		lastLeadPunct: false,
		lastEndPunct: false,
		posEvents: [],
		negEvents: [],
				 
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append("<div id='paragraph_container' class='container bg-white'></div>");
			$('#paragraph_container').append('<div id="transcript" class="transcript proxima-nova-400 size-48"></div>');
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
			$('#paragraph_container #transcript').empty();
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

		clearTimeoutEvents: function(type) {
	    var events;
	    if (type == 'posemo') events = this.posEvents;
	    else events = this.negEvents;
	    
	    for (var i=0; i<events.length; i++) {
		    clearTimeout(events[i]);
	    }
    },
		
		appendWordInContext: function(msg) {

			var c = 'blank';
		 	if($.inArray('posemo', msg.cats) >= 0) c = 'posemo';
		 	else if($.inArray('negemo', msg.cats) >= 0) c = 'negemo';
		 	
		 	//console.log(msg.word);
		 	var word = this.htmlEncode(msg.word);
		 	
		 	// end punct always followed by space
		 	if($.inArray('endPunct', msg.cats) >= 0){
		 		var e = $('<span class="' + c + '">' + word + ' ' + '</span>');
				$('#paragraph_container #transcript').append(e);

				this.lastLeadPunct = false;
				this.lastEndPunct = true;
		 	}
		 	
		 	// lead punct
		 	else if ($.inArray('leadPunct', msg.cats) >= 0){
		 		//no lead space if it follows a sentence end
		 		var e; 
		 		if (this.lastEndPunct) e = $('<span class="' + c + '">' + word + '</span>');
		 		else e = $('<span class="' + c + '">' + ' ' + word + '</span>');

		 		$('#paragraph_container #transcript').append(e);

		 		this.lastLeadPunct = true;
		 		this.lastEndPunct = false;
			}
			// words get a preceeding space, unless they follow lead punct
		 	else {	
		 		
		 		if (!this.lastLeadPunct) e = $('#paragraph_container #transcript').append('<span class="space"> </span>');
		 		var e = $('<span class="' + c + '">' + word + '</span>');

		 		$('#paragraph_container #transcript').append(e);

		 		if (c != 'blank') {
		 			e.addClass('marked');
		 		}

		 		this.lastLeadPunct = false;
		 		this.lastEndPunct = false;
		 	}
		 	
		}
	}
};