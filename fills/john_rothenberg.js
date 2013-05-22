var mode = function(id) {

	return {
	
		name: "Tagged Transcript",
		defaultURL: "http://www.youtube.com/watch?v=1yD8PzFFNFU",
		//el: $('<div class="modeContainer" id="'+this.name+'"></div>'),
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		lastLeadPunct: 0,
		lastEndPunct: 0,
		setTimeoutEvents: [],
				 
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append("<div id='jro' class='container bg-white'></div>");
			$('#jro').append('<div id="transcript" class="color-tween museo-slab-300 size-32"></div>');
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
			$('#transcript').empty();
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

		htmlEncode: function(value){
  			//create a in-memory div, set it's inner text(which jQuery automatically encodes)
  			//then grab the encoded contents back out.  The div never exists on the page.
  			return $('<div/>').text(value).html();
		},

		clearTimeoutMessages: function() {
    	console.log("clear timeouts");
	    for (var i=0; i<setTimeoutEvents.length; i++) {
		    clearTimeout(setTimeoutEvents[i]);
	    }
    },
		
		appendWordInContext: function(msg) {

			var green = 'rgb(78, 191, 125)';
			var yellow = 'rgb(255, 193, 65)';
			var blue = 'rgb(45, 203, 237)';
			var orange = 'rgb(209, 85, 50)';
			var black = 'rgb(61, 59, 56)';

			var c = 'blank';
		 	if($.inArray('posemo', msg.cats) >= 0) c = 'posemo';
		 	else if($.inArray('negemo', msg.cats) >= 0) c = 'negemo';
		 	else if($.inArray('certain', msg.cats) >= 0) c = 'certain';
		 	else if($.inArray('tentat', msg.cats) >= 0) c = 'tentat';
		 	
		 	//console.log(msg.word);
		 	var word = this.htmlEncode(msg.word);
		 	//console.log(word);
		 	
		 	// end punct always followed by space
		 	if($.inArray('endPunct', msg.cats) >= 0){
		 		var e = $('<span class="' + c + '">' + word + ' ' + '</span>');
				$('#transcript').append(e);
				e.css("color", black);

				this.lastLeadPunct = 0;
				this.lastEndPunct = 1;
		 	}
		 	// lead punct
		 	else if ($.inArray('leadPunct', msg.cats) >= 0){
		 		//no lead space if it follows a sentence end
		 		var e; 
		 		if (this.lastEndPunct) e = $('<span class="' + c + '">' + word + '</span>');
		 		else e = $('<span class="' + c + '">' + ' ' + word + '</span>');

		 		$('#transcript').append(e);
		 		e.css("color", black);

		 		this.lastLeadPunct = 1;
		 		this.lastEndPunct = 0;
			}
			// words get a preceeding space, unless they follow lead punct
		 	else {	

		 		
		 		if (!this.lastLeadPunct) e = $('#transcript').append('<span class="space"> </span>');
		 		var e = $('<span class="' + c + '">' + word + '</span>');

		 		$('#transcript').append(e);

		 		if (c != 'blank') {
		 			e.addClass('marked');
		 			e.addClass('bgcolor-tween');
		 			
		 			if (c == 'posemo') e.css("background-color", blue);
		 			else if (c == 'negemo') e.css("background-color", yellow);
		 			else if (c == 'certain') e.css("background-color", green);
		 			else e.css("background-color", orange);
		 		}

		 		this.lastLeadPunct = 0;
		 		this.lastEndPunct = 0;
		 	}

		 	//animating words
		 	if (c != 'blank')
		 	{

				//PEND: clear existing timeouts
				// see - pausePlaybackMessages() in player.js
				//clearTimeoutMessages();


		 		//console.log("Colored");
	 			$('.marked').each(function(i) {
	 				
	 				var delay = 3000;

	 				if (!$(this).hasClass(c)) {
	 					$(this).css("background-color", "transparent");
	 					$(this).on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() { 
	 						
							setTimeout( function(element) {
								if (element.hasClass('posemo')) element.css("background-color", blue);
								else if (element.hasClass('negemo')) element.css("background-color", yellow);
								else if (element.hasClass('certain')) element.css("background-color", green);
								else element.css("background-color", orange);
							}, delay + i*250, $(this));

						});
						
	 				}
	
	 			});

	 			//fade up the words from the category
	 			
	 			$('.' + c).each(function(i) {

 					if ($(this).hasClass('posemo')) $(this).css("background-color", blue);
					else if ($(this).hasClass('negemo')) $(this).css("background-color", yellow);
					else if ($(this).hasClass('certain')) $(this).css("background-color", green);
					else $(this).css("background-color", orange);

				});

				
				
		 	}

		 	
		}
	}
};