/*

See Left Scroll Template (template_leftScroll.js) for a
fully-commented explanation of methods and usage.

*/

var mode = function(id) {

	return {
	
		name: "One Word",

		defaultURL: "http://www.youtube.com/watch?v=l-gQLqv9f4o&t=0m12s",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		template: true,
				 

		// INITIALIZE MODE.
		// Do anything you want to do to set up your mode the first time here.
		// This gets called once after the mode is loaded.
		init: function() {
			this.el.append('<div class="topContainer"><div id="onebyone" class="centerContainer proxima-nova-400"></div></div>');
		},

		// ENTER MODE.
		// This gets called each time you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
			//this.el.find('.centerContainer').empty();
			$('#onebyone').empty();
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
		
		// APPEND WORD TO DOM.
		// This is where you insert your words into the DOM.
		appendWordInContext: function(msg) {
		
			// Choose a color based on the category of the word in the LIWC Dictionary.
			// These are five very broad LIWC categories that we use in this example.
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