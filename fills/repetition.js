/*

Word repetition demo. Jan Wolski 2013. Based on "template_paragraph".

*/

var repetition = function(id) {

	return {
	
		name: "Repetition",
		author: "Jan Wolski",
		defaultURL: "http://www.youtube.com/watch?v=PKffm2uI4dk",
		$el: $('<div class="modeContainer" id="'+id+'"></div>'),
		
		
		lastLeadPunct: false,
		lastEndPunct: false,
		posEvents: [],
		negEvents: [],
				 
		// INITIALIZE MODE.
		// Do anything you want to do to set up your mode the first time here.
		// This gets called once after the mode is loaded.
		init: function() {
			this.$el.append("<div id='repetition_container' class='container bg-white'></div>");
			$('#repetition_container').append('<div id="transcript" class="transcript proxima-nova-400 size-48"></div>');
		},

		// ENTER MODE.
		// This gets called each time you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
			$('#repetition_container #transcript').empty();
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
		 	
		 	// end punct always followed by space
		 	if($.inArray('endPunct', msg.cats) >= 0){
		 		var e = $('<span class="' + c + '">' + msg.word + ' ' + '</span>');
				$('#repetition_container #transcript').last().append(e);

				if($.inArray(msg.word , [".", "!", "?"]) >= 0){
					$("span").css("background-color", "transparent");
		 			$("span").css("color", "white");
					$('#repetition_container').append('<div id="transcript" class="transcript proxima-nova-400 size-48"></div>');
				}

				this.lastLeadPunct = false;
				this.lastEndPunct = true;
		 	}
		 	
		 	// lead punct
		 	else if ($.inArray('leadPunct', msg.cats) >= 0){
		 		//no lead space if it follows a sentence end
		 		
		 		if (this.lastEndPunct) e = $('<span class="' + c + '">' + msg.word + '</span>');
		 		else e = $('<span class="' + c + '">' + ' ' + msg.word + '</span>');

		 		$('#repetition_container #transcript').last().append(e);

		 		this.lastLeadPunct = true;
		 		this.lastEndPunct = false;
			}
			// words get a preceeding space, unless they follow lead punct
		 	else {	
		 		
		 		var e;
		 		var hitNum = $("span."+msg.word).length;
		 		console.log("Hits :" + hitNum);
		 		c = msg.word;
		 		if (!this.lastLeadPunct) e = $('#repetition_container #transcript').append('<span class="space"> </span>');
		 		e = $('<span class="' + c + '">' + msg.word + '</span>');

		 		$("span."+msg.word).css("background-color", "red");
		 		$('#repetition_container #transcript').last().append(e);

		 		if (hitNum > 0 ) $("span."+msg.word).last().css("background-color", "white");

		 		this.lastLeadPunct = false;
		 		this.lastEndPunct = false;
		 	}

		 	
		}
	}
};