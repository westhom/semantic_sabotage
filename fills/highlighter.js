var mode = function(id) {

	return {
	
		name: "Highlighter",
		defaultURL: "http://www.youtube.com/watch?v=4H5ocEjhkYw&t=0m6s",
		//el: $('<div class="modeContainer" id="'+this.name+'"></div>'),
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		lastLeadPunct: 0,
		lastEndPunct: 0,
		posEvents: [],
		negEvents: [],
				 
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append("<div id='tagged_container' class='container bg-white'></div>");
			$('#tagged_container').append('<div id="transcript" class="transcript museo-slab-300 size-32"></div>');
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
			$('#tagged_container #transcript').empty();
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

		clearTimeoutEvents: function(type) {
	    var events;
	    if (type == 'posemo') events = this.posEvents;
	    else events = this.negEvents;
	    
	    for (var i=0; i<events.length; i++) {
		    clearTimeout(events[i]);
	    }
    },
		
		appendWordInContext: function(msg) {

			var blue = 'rgb(45, 203, 237)';
			//var red = 'rgb(209, 85, 50)';
			var red = 'rgb(250, 69, 54)';
			var black = 'rgb(61, 59, 56)';
			var white = 'rgb(250, 250, 250)'

			var c = 'blank';
		 	if($.inArray('posemo', msg.cats) >= 0) c = 'posemo';
		 	else if($.inArray('negemo', msg.cats) >= 0) c = 'negemo';
		 	
		 	//console.log(msg.word);
		 	var word = this.htmlEncode(msg.word);
		 	//console.log(word);
		 	
		 	// end punct always followed by space
		 	if($.inArray('endPunct', msg.cats) >= 0){
		 		var e = $('<span class="' + c + '">' + word + ' ' + '</span>');
				$('#tagged_container #transcript').append(e);
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

		 		$('#tagged_container #transcript').append(e);
		 		e.css("color", black);

		 		this.lastLeadPunct = 1;
		 		this.lastEndPunct = 0;
			}
			// words get a preceeding space, unless they follow lead punct
		 	else {	

		 		
		 		if (!this.lastLeadPunct) e = $('#tagged_container #transcript').append('<span class="space"> </span>');
		 		var e = $('<span class="' + c + '">' + word + '</span>');

		 		$('#tagged_container #transcript').append(e);

		 		if (c != 'blank') {
		 			e.addClass('marked');
		 			e.addClass('bgcolor-tween');
		 			e.addClass('color-tween');
		 			
		 			if (c == 'posemo') e.css("background-color", blue);
		 			else if (c == 'negemo') e.css("background-color", red);
		 		}

		 		this.lastLeadPunct = 0;
		 		this.lastEndPunct = 0;
		 	}

		 	//animating words based on categorization
		 	if (c != 'blank')
		 	{
		 		var events; 
		 		if (c == 'posemo') events = this.posEvents;
		 		else events = this.negEvents;

		 		this.clearTimeoutEvents(c);
	
		 		var delay = 2500;

	 			$('.marked').each(function(i) {
	 				//find all the words of the same class
	 				if ($(this).hasClass(c)) 
	 				{
	 					//set their colors
	 					if ($(this).hasClass('posemo')) {
	 						$(this).css("color", black);
	 						$(this).css("background-color", blue);
	 					}
						else if ($(this).hasClass('negemo')) {
							$(this).css("color", white);
							$(this).css("background-color", red);
						}
	 					
	 					events.push(setTimeout( function(element) {
	 							element.css("background-color", "transparent");
	 					}, delay, $(this)));

	 					events.push(setTimeout( function(element) {
	 							if (element.hasClass('posemo')) element.css("color", blue);
								else if (element.hasClass('negemo')) element.css("color", red);
	 					}, delay+400, $(this)));

	 				}
	 			});
	 		}

		 	
		}
	}
};