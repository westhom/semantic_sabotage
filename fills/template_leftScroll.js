/*

Left Scroll Template 

This is the template for an auto scrolling line of text.
It shows the basics of handling incoming words and 
coloring them based on their categories in the LIWC dictionary. 
See template_leftScroll.css for associated styles.

*/

var mode = function(id) {

	return {

		// This is what your mutation is called on the menue page.
		name: "Left Scroll",
		// This is the YouTube movie that is automatically loaded when you first go to the mutation.
		// Note: If you want the YouTube movie to start at a time other than the beginning, 
		// attach the &t=0m3s tag to your URL with the desired start time.
		defaultURL: "http://www.youtube.com/watch?v=NF3FmHw_N9A&t=0m3s",
		// Don't change this. This line creates the associated div for your mutation and names it 
		// based on the name of your js file.
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		// When you create your own mutation, you can delete this line. 
		template: true,
		// This variable is for tracking punctuation rules
		sentenceTermination: false,
		lastLeadPunct: false,
				 
		// Do anything you want to do to set up your mode the first time.
		// This gets called once after the mode is loaded.
		init: function() {
			// Here, we insert a 
			this.el.append("<div id='templateLeftScroll' class='topContainer'><div class='scroller'></div></div>");
		},

		// This gets called each time you go to the mode.
		enter: function() {			
			// In this case, we empty the div that moves the words.
			$('#templateLeftScroll > .scroller').empty();
			// And we reset its position.
			$('#templateLeftScroll > .scroller').css('left', '0px');
		},

		// Called each time a new word is ready. 
		handleWord: function(msg) {
			//console.log('word '+msg.word);
			this.appendWordInContext(msg);
		},
		
		// Called each time a new sentence is complete.
		handleSentenceEnd: function(msg) {
			//console.log('sentenceEnd');	
		},
		
		// Called with each sentence.
		// Passes a collection of interesting language statistics.
		handleStats: function(msg) {
			//console.log(msg);
		},
		
		// This is where you insert your words into the DOM.
		appendWordInContext: function(msg) {
		 	
		 	// Choose a color based on the category of the word in the LIWC Dictionary.
		 	// These are five very broad LIWC categories
		 	var c;
		 	if($.inArray('cogmech', msg.cats) >= 0) c = 'rgb(51,154,96)';  			//green
		 	else if($.inArray('social', msg.cats) >= 0) c = 'rgb(193,250,164)';	//light green
		 	else if($.inArray('affect', msg.cats) >= 0) c = 'rgb(232,218,122)'; //yellow
		 	else if($.inArray('percept', msg.cats) >= 0) c = 'rgb(255,161,92)'; //orange
		 	else if($.inArray('verb', msg.cats) >= 0) c = 'rgb(237,75,58)'; 		//red
		 	else c = 'rgb(255,255,255)';

		 	var msgWord = msg.word;
		
			// If the word is not end punctuation, add a space before the word.
		 	if($.inArray('endPunct', msg.cats) < 0){
		 		// But only if it doesn't follow lead punctuation
		 		if (!this.lastLeadPunct) msgWord = ' '+msg.word;
		 	}
		 	// Any word gets a preceeding space when it follows sentence termination
		 	else if (this.sentenceTermination) {
		 		msgWord = ' '+msg.word;
		 	}

		 	// Keep track of whether the word ends the sentence
		 	if ((msg.word == '.') || (msg.word == '!') || (msg.word == '?')) this.sentenceTermination = true;
		 	else this.sentenceTermination = false;

		 	// Keep track of lead punctuation for layout rules
		 	if($.inArray('leadPunct', msg.cats) >= 0) this.lastLeadPunct = true;
		 	else this.lastLeadPunct = false;

		 	// Create the span element that contains the word.
		 	var w = $('<span class= "scrollword proxima-nova-400-italic" style="color:' + c + ';">' + msgWord + '</span>');
		 	// Append it to the scroller div.
		 	$('#templateLeftScroll > .scroller').append(w); 	

		 	// Move the scroller div based on the position of the last word added.
		 	$('#templateLeftScroll > .scroller').css('left', -parseInt($('#templateLeftScroll > .scroller span:last-child').position().left)+'px');	

		}
	}
};