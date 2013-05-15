var mode = function(id) {

	return {
	
		name: "Lyrics Test",

		defaultURL: "http://www.youtube.com/watch?v=cpQtyCCJk0c",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
				 

		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append("<div id='one' class='container'></div><div id='two' class='container2'>LEFT</div><div id='three' class='container3'>LEFT</div><div id='four' class='container4'>LEFT</div><div id='five' class='container5'>LEFT</div><div id='six' class='container6'>LEFT</div>");
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			//console.log(this.name+" enter()");
			$('#one').empty();
			$('#two').empty();
			$('#three').empty();
			$('#four').empty();
			$('#five').empty();
			$('#six').empty();
		},


		// Handle incoming word message.
		handleWord: function(msg) {
			console.log('word '+msg.word);
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
		
		 	// update curSentence
		 	if (!msg.sentenceStartFlag && !msg.punctuationFlag)
		 		this.el.append(' ');
		 	
		 	var c;
		 	if($.inArray('funct', msg.cats) >= 0) c = 'rgb(255,0,0)';		 	
		 	//else if($.inArray('heshe', msg.cats) >= 0) c = 'rgb(240,0,0)';
		 	else if($.inArray('verbs', msg.cats) >= 0) c = 'rgb(240,240,0)';
		 	else c = 'rgb(0,0,0)';

		 	//c = 'rgb(10,10,10)';

		 	var newWord = $('<div class= "bigText museo-slab-300" style="color:' + c + ';">' + msg.word + '</div>');
		 	
		 	setTimeout(function() { 
		 		newWord.css({'color':'rgb(255,255,255)', 'opacity':'0', 'top':'1000px'});
		 	}, 20);

		 	setTimeout(function() {
		 		newWord.remove();
		 	}, 6000);

		 	if (msg.word.length === 1) {
			 	$('#one').prepend(newWord);
			} else if (msg.word.length === 2) {
			 	$('#two').prepend(newWord);

			 	
			} else if (msg.word.length === 3)
			 	$('#three').prepend(newWord);
			else if (msg.word.length === 4)
			 	$('#four').prepend(newWord);
			else if (msg.word.length === 5)
			 	$('#five').prepend(newWord);	
			else 
			 	$('#six').prepend(newWord);					 			 				 
		}
	}
};