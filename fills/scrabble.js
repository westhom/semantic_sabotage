var mode = function(id) {

	return {
	
		name: "Scrabble",

		defaultURL: "http://www.youtube.com/watch?v=CrB2lxnpDJU",
		//usfRtJpyJDk = how to behave in court
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		fontSize: 200,
		letterSpacing: 0.4*200,
		lastWord: null,
		foundFlags: [],
				 

		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append('<div class="topContainer"><div class="centerContainer motor"></div></div>');
			
			for(var i=0; i < 128; i++){
				this.foundFlags.push(false);
			}
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
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


			if($.inArray('punct', msg.cats) < 0)
			{
				if(msg.word.length > 4){
					console.log(msg.word);
				 	
				 	// Reset used flags
				 	this.el.find('.centerContainer').children().each(function(i){
				 		$(this).attr("used", "false");
				 		$(this).css('color', 'black');
				 	});
				 	
				 	var flags = this.foundFlags;
				 	var sp = this.letterSpacing;

				 	for(var j=0; j<msg.word.length; j++){
				 		flags[j] = false;
				 	}

				 	for(var i=0; i < msg.word.length; i++){
				 		
				 		if(!flags[i]){

				 			this.el.find('.centerContainer').children().each(function(){
				 				if($(this).attr("used") == "false"){
						 			if(msg.word[i] == $(this).html()){
						 				// Move to position in new word.
						 				$(this).css('left', i*sp+'px');						 				
						 				console.log('moved '+$(this).html()+' to new position '+i*sp);
						 				// Set to used.
						 				$(this).attr("used", "true");
						 				//console.log($(this).html()+' is used = '+$(this).attr("used"));
						 				// Set found flag
						 				flags[i] = true;
						 			}
					 			}
				 			});
				 		}				 	
				 	}
				 	
				 // Get rid of the unused letters.
			 		this.el.find('.centerContainer').children().each(function(i){			 			
			 			if($(this).attr("used")=="false"){
			 					$(this).remove();
			 			}	
			 		});

			 		
			 		// Create letters for 
			 		for(var j=0; j < msg.word.length; j++){
			 			if(flags[j] == false){
			 				//console.log('new letter = '+msg.word[j]);		
			 				
				 		
				 			var newLetter = $('<span class="letter" style="left:'+ j*this.letterSpacing +'px; top:200px; opacity:0; color:white;">'+msg.word[j]+'</span>');
				 			this.el.find('.centerContainer').append(newLetter);
				 			
				 			 
				 			setTimeout(function(el){
				 				el.css('top', '0px');
				 				el.css('opacity', '1');
				 			}, 300, newLetter);
							

			 			}
			 		}
					
	 				this.lastWord = msg.word;
	
 				}
		 	}
		}

	}
};