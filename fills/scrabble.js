var mode = function(id) {

	return {
	
		name: "Scrabble",

		defaultURL: "http://www.youtube.com/watch?v=CrB2lxnpDJU",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		// Sets size of words.
		fontSize: 200,
		// Since we're using a monospace font, this sets the space between the letters
		// as a fraction of the fontSize
		letterSpacing: 0.4*200,
		// This is used to keep track of the previous word
		lastWord: null,
		// This is an array used to keep track of whether we have found
		// each letter in a new word in the previous word.
		foundFlags: [],
				 

		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			// Insert container.
			this.el.append('<div class="topContainer"><div class="centerContainer motor"></div></div>');
			// Initialize all flags to false.
			for(var i=0; i < 128; i++){
				this.foundFlags.push(false);
			}
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			//console.log(this.name+" enter()");
			// Clear out any old elements on enter.
			this.el.find('.centerContainer').empty();
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

			// If it's not punctuation.
			if($.inArray('punct', msg.cats) < 0)
			{
				// convert the incoming word to lowercase
				var word = msg.word.toLowerCase();

				// If the word is longer than 4 letters long.
				// Note: We're doing this to slow the flow of words and give
				// the letter animations time to play out.
				if(word.length > 4){
					//console.log(word);
				 	
				 	// For all the letters current in the DOM.
				 	this.el.find('.centerContainer').children().each(function(i){
				 		// Set their "used" attribute to false and their color to black.
				 		// Note: "used" is a custom attribute we added to the element.
				 		$(this).attr("used", "false");
				 		$(this).css('color', 'black');
				 	});
				 	
				 	// Grab these variables before changing scope below.
				 	var flags = this.foundFlags;
				 	var sp = this.letterSpacing;

				 	// Reset all the found flags.
				 	for(var j=0; j<word.length; j++){
				 		flags[j] = false;
				 	}

				 	// For each letter in the new incoming word.
				 	for(var i=0; i < word.length; i++){
				 		// If it hasn't been found yet.
				 		if(!flags[i]){
				 			// For each letter in the current word on screen.
				 			this.el.find('.centerContainer').children().each(function(){
				 				// If the letter has not already been used.
				 				if($(this).attr("used") == "false"){
				 					// If the letter matches the letter in the incoming word.
						 			if(word[i] == $(this).html()){
						 				// Move it to the position in the new incoming word.
						 				$(this).css('left', i*sp+'px');						 										 				
						 				// Flag as used.
						 				$(this).attr("used", "true");
						 				// Set found flag.
						 				flags[i] = true;
						 			}
					 			}
				 			});
				 		}				 	
				 	}
				 	
				 // Get rid of the unused letters.
				 // For all letters currently on screen.
			 		this.el.find('.centerContainer').children().each(function(i){			 			
			 			// If the letter hasn't been used.
			 			if($(this).attr("used")=="false"){
			 					$(this).remove();
			 			}	
			 		});

			 		
			 		// Create elements for letters that haven't been found in previous word. 
			 		for(var j=0; j < word.length; j++){			 			
			 			if(flags[j] == false){
			 				// Create element and position it appropriately. 	 				
				 			var newLetter = $('<span class="letter" style="left:'+ j*this.letterSpacing +'px; top:200px; opacity:0; color:white;">'+word[j]+'</span>');
							// Append it to the DOM.				 			
				 			this.el.find('.centerContainer').append(newLetter);
				 			
				 			// Wait a bit, then animate the opacity and top position of the new letter.
				 			setTimeout(function(el){
				 				el.css('top', '0px');
				 				el.css('opacity', '1');
				 			}, 300, newLetter);

			 			}
			 		}
					// Keep track of the previous word.
	 				this.lastWord = word;
	
 				}
		 	}
		}

	}
};