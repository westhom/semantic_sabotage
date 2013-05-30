var mode = function(id) {

	return {
	
		name: "Blurry Notdone",
		defaultURL: "http://www.youtube.com/watch?v=3zi699WzAL0",
		//el: $('<div class="modeContainer" id="'+this.name+'"></div>'),
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		
		lastLeadPunct: false,
		lastEndPunct: false,
		posEvents: [],
		negEvents: [],
				 
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append("<div id='blurry_container' class='container' style='background-color: #191919'></div>");
			$('#blurry_container').append('<div id="transcript" class="transcript proxima-nova-400 size-48"></div>');
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
			$('#blurry_container #transcript').empty();
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

			var cat = 'blank';
			var catColor = '#FFBE73'; //tan
		 	if($.inArray('work', msg.cats) >= 0) { 
		 		cat = 'work';
		 		catColor = '#0A7AA6'; //blue
		 	} else if($.inArray('relig', msg.cats) >= 0) {
		 		cat = 'relig';
		 		catColor = '#FF8900'; //bright orange
		 	} else if($.inArray('relativ', msg.cats) >= 0) {
		 		cat = 'relativ';
		 		catColor = '#FFB800'; //yellow
		 	} else if(msg.cats.length === 0) { //not in dictionary
		 		cat = 'nocat';
		 		catColor = '#F23005'; //red
		 		console.log('missing word :'+msg.word)
			}		 	

		 	//console.log(msg.word);
		 	var word = this.htmlEncode(msg.word);
		 	
		 	// end punct always followed by space
		 	if($.inArray('endPunct', msg.cats) >= 0){
		 		var e = $('<span class="' + cat + '">' + word + ' ' + '</span>');
				$('#blurry_container #transcript').append(e);

				this.lastLeadPunct = false;
				this.lastEndPunct = true;
		 	}
		 	
		 	// lead punct
		 	else if ($.inArray('leadPunct', msg.cats) >= 0){
		 		//no lead space if it follows a sentence end
		 		var s; 
		 		if (this.lastEndPunct) s = $('<span class="' + cat + '">' + word + '</span>');
		 		else s = $('<span class="' + cat + '">' + ' ' + word + '</span>');
				$(s).css('color',catColor);
		 		$('#blurry_container #transcript').append(s);

				setTimeout(function(e){
					e.css({'color':'transparent', 'text-shadow':'0 0 36px '+ catColor});
				}, 20, s);

		 		this.lastLeadPunct = true;
		 		this.lastEndPunct = false;
			}
			// words get a preceeding space, unless they follow lead punct
		 	else {	
		 		
		 		if (!this.lastLeadPunct) $('#blurry_container #transcript').append('<span class="space"> </span>');
		 		var s = $('<span class="' + cat + '">' + word + '</span>');
				$(s).css('color',catColor);
		 		$('#blurry_container #transcript').append(s);
			
				setTimeout(function(e){
					e.css({'color':'transparent', 'text-shadow':'0 0 36px '+ catColor});
				}, 20, s);

		 		if (cat != 'blank') {
		 			s.addClass('marked');
		 		}

		 		this.lastLeadPunct = false;
		 		this.lastEndPunct = false;
		 	}
		 	
		}
	}
};