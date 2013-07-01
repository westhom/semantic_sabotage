/*

See Left Scroll Template (template_leftScroll.js) for a
fully-commented explanation of methods and usage.

*/

var template_paragraph = function(id) {

	return {
	
		name: "Paragraph",
		defaultURL: "http://www.youtube.com/watch?v=PKffm2uI4dk",
		$el: $('<div class="modeContainer" id="'+id+'"></div>'),
		template: true,
		
		lastLeadPunct: false,
		lastEndPunct: false,
		posEvents: [],
		negEvents: [],
				 
		// INITIALIZE MODE.
		// Do anything you want to do to set up your mode the first time here.
		// This gets called once after the mode is loaded.
		init: function() {
			this.$el.append("<div class='paragraph_container container bg-white'></div>");
			this.$el.find('.paragraph_container').append('<div class="transcript proxima-nova-400 size-48"></div>');
		},

		// ENTER MODE.
		// This gets called each time you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
			this.$el.find('.paragraph_container .transcript').empty();
		},

		// HANDLE INCOMING word MESSAGE.
		// Called each time a new word is ready. 
		handleWord: function(msg) {
			//console.log('word '+msg.word);
			this.appendWordInContext(msg);
		},
		
		// HANDLE INCOMING sentenceEnd MESSAGE.
		// Called each time a new sentence is complete.
		handleSentenceEnd: function(msg) {
			//console.log('sentenceEnd');	
		},
		
		// HANDLE INCOMING stats MESSAGE.
		// Called with each sentence.
		// Passes a collection of interesting language statistics.
		handleStats: function(msg) {
			//console.log(msg);
		},

		clearTimeoutEvents: function(type) {
		    var events;
		    if (type == 'posemo') events = this.posEvents;
		    else events = this.negEvents;
		    
		    for (var i=0; i<events.length; i++) {
			    clearTimeout(events[i]);
		    }
    	},
		
		// APPEND WORD TO DOM.
		// This is where you insert your words into the DOM.
		appendWordInContext: function(msg) {

			var c = 'blank';
		 	if($.inArray('posemo', msg.cats) >= 0) c = 'posemo';
		 	else if($.inArray('negemo', msg.cats) >= 0) c = 'negemo';
		 	
		 	//console.log(msg.word);
		 	
		 	// end punct always followed by space
		 	if($.inArray('endPunct', msg.cats) >= 0){
		 		var e = $('<span class="' + c + '">' + msg.word + ' ' + '</span>');
				this.$el.find('.paragraph_container .transcript').append(e);

				this.lastLeadPunct = false;
				this.lastEndPunct = true;
		 	}
		 	
		 	// lead punct
		 	else if ($.inArray('leadPunct', msg.cats) >= 0){
		 		//no lead space if it follows a sentence end
		 		var e; 
		 		if (this.lastEndPunct) e = $('<span class="' + c + '">' + msg.word + '</span>');
		 		else e = $('<span class="' + c + '">' + ' ' + msg.word + '</span>');

		 		this.$el.find('.paragraph_container .transcript').append(e);

		 		this.lastLeadPunct = true;
		 		this.lastEndPunct = false;
			}
			// words get a preceeding space, unless they follow lead punct
		 	else {	
		 		
		 		var e;
		 		if (!this.lastLeadPunct) e = this.$el.find('.paragraph_container .transcript').append('<span class="space"> </span>');
		 		e = $('<span class="' + c + '">' + msg.word + '</span>');

		 		this.$el.find('.paragraph_container .transcript').append(e);

		 		if (c != 'blank') {
		 			e.addClass('marked');
		 		}

		 		this.lastLeadPunct = false;
		 		this.lastEndPunct = false;
		 	}
		 	
		}
	}
};