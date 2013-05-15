var mode = function(id) {

	return {
	
		name: "Scroll Ticker",

		defaultURL: "http://www.youtube.com/watch?v=usfRtJpyJDk",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
				 

		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append("<div id='scrollticker' class='topContainer'><div class='scroller'></div></div>");
		},

		// Gets called evertime you go to the mode.
		enter: function() {			
			$('#scrollticker > .scroller').empty();
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
		 	if($.inArray('funct', msg.cats) >= 0) c = 'rgb(255,255,0)';
		 	else if($.inArray('percept', msg.cats) >= 0) c = 'rgb(0,255,0)';
		 	else if($.inArray('heshe', msg.cats) >= 0) c = 'rgb(0,255,0)';
		 	else if($.inArray('verbs', msg.cats) >= 0) c = 'rgb(255,255,0)';
		 	else c = 'rgb(255,255,255)';

		 	var msgWord = msg.word;
		 	// If not punct, add a space then the word
		 	if($.inArray('punct', msg.cats) < 0){
		 		msgWord = ' '+msg.word;
		 	}

		 	var w = $('<span class= "scrollword museo-slab-300-italic" style="color:' + c + ';">' + msgWord + '</span>');
		 	$('#scrollticker > .scroller').append(w); 	

		 	$('#scrollticker > .scroller').css('left', -parseInt($('#scrollticker > .scroller span:last-child').position().left)+'px');	
			console.log(-parseInt($('#scrollticker > .scroller span:nth-last-child(4)').position().left)+'px');	

			setTimeout(function(e){
				e.css('color', 'rgb(100,100,100)');
			}, 20, w);
		}
	}
};