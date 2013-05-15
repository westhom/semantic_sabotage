var mode = function(id) {

	return {
	
		name: "Fading Words",
		defaultURL: "http://www.youtube.com/watch?v=mox4InKEwgU",
		//el: $('<div class="modeContainer" id="'+this.name+'"></div>'),
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
				 

		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append("<div id='faded' class='container'></div>");
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
			$('#faded').empty();
		},


		// Handle incoming word message.
		handleWord: function(msg) {
			//console.log('word '+msg.word);
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

		 	var newWord = $('<span class= "bigText franklin-gothic-condensed" style="color:' + c + ';">' + msg.word + '</span>');
		 	
		 	setTimeout(function() { 
		 		newWord.css({'color':'rgb(255,255,255)', 'opacity':'0', 'top':'1000px'});
		 	}, 20);

		 	setTimeout(function() {
		 		newWord.remove();
		 	}, 6000);
		 	//$(newWord).animate({opacity:'0'}, 1000, 'linear', function(){
		 	//	$(this).remove();
		 	//});

		 	$('#faded').append(newWord);

		 	
		}
	}
};