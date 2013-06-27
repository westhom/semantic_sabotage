var black_list = function(id) {

	return {
	
		name: "Black List",
		author: "Sosolimited",
		
		defaultURL: "http://www.youtube.com/watch?v=Ia7N1l7zrlk&t=0m4s",
		//el: $('<div class="modeContainer" id="'+this.name+'"></div>'),
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
				 

		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			// Insert the container for the words.
			this.el.append("<div class='faded container'></div>");
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
			$('.faded').empty();
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
			 	
			// Set the initial color of each word based on 
			// the associated LIWC categories.
		 	var c;
		 	var d;
		 	if($.inArray('work', msg.cats) >= 0 || 
		 		$.inArray('money', msg.cats) >= 0) {
		 		c = 'rgb(255,0,0)'; // red
		 		d = 1800 + Math.round(Math.random()*100);		 		
		 	}
		 	else if($.inArray('posemo', msg.cats) >= 0 || 
		 		$.inArray('negemo', msg.cats) >= 0 ||
		 		$.inArray('affect', msg.cats) >= 0) {
		 		c = 'rgb(0,0,180)'; // blue
		 		d = 2200 + Math.round(Math.random()*100);		 		
		 	}
		 	else if($.inArray('relig', msg.cats) >= 0 || 
		 		$.inArray('death', msg.cats) >= 0) {
		 		c = 'rgb(100,0,0)'; // red
		 		d = 2000 + Math.round(Math.random()*100);		 		
			}
		 	else if($.inArray('social', msg.cats) >= 0 || 
		 		$.inArray('family', msg.cats) >= 0 || 
		 		$.inArray('friend', msg.cats) >= 0 || 
		 		$.inArray('human', msg.cats) >= 0) {
		 		c = 'rgb(160,0,0)'; // deep red
		 		d = 1900 + Math.round(Math.random()*100);		 		
			}
		 	else{
		 		// Only flash words longer than three letters white.
		 		// Make shorter words black.
		 		if(msg.word.length > 3)
		 		 c = 'rgb(255,255,255)';
		 		else
		 		 c ='rgb(0,0,0)';
		 		d = 2100 + Math.random()*100;		 		
		 	}
		 	// Create span element for word, using the color chosen above.
		 	var newWord = $('<span class= "bigText franklin-gothic-condensed" style="color:' + c + ';">' + msg.word + '</span>');

		 	// Use setTimeout to wait until the element has been inserted into the DOM.
		 	// Then set its color to black, it's opacity to 0.5, and its height to 2000
		 	// Note: Since all of these attributes are set up with CSS transitions, they will animate.
		 	// Note: The small delay before the word falls is set with the CSS transition.
		 	setTimeout(function() { 
		 		newWord.css({'color':'rgb(0,0,0)', 'opacity':'0.5', 'top': d + 'px'});
		 	}, 20);

		 	// After 6 seconds, remove the word from the DOM.
		 	setTimeout(function() {
		 		newWord.remove();
		 	}, 6000);
		 	
		 	// Insert the element into the container.
		 	$('.faded').append(newWord);

		 	
		}
	}
};