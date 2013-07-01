var plot_erosion = function(id) {

	return {
	
		name: "Plot Erosion",
		author: "Sosolimited",
		
		defaultURL: "http://www.youtube.com/watch?v=3zi699WzAL0",
		//defaultURL: "http://www.youtube.com/watch?v=RB1OhJBbzkM", //rupert sheldrake metaphysics
		//defaultURL: "http://www.youtube.com/watch?v=9vs00tYPmbU",
		//$el: $('<div class="modeContainer" id="'+this.name+'"></div>'),
		$el: $('<div class="modeContainer" id="'+id+'"></div>'),
		
		lastLeadPunct: false,
		lastEndPunct: false,
		posEvents: [],
		negEvents: [],
				 
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.$el.append("<div class='blurry_container container' style='background-color: #191919'></div>");
			this.$el.find('.blurry_container').append('<div class="transcript meta-serif-book"></div>');
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
			this.$el.find('.blurry_container .transcript').empty();
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
			//var catColor = '#FFBE73'; //tan
		 	if($.inArray('work', msg.cats) >= 0) { 
		 		cat = 'work';
		 		//catColor = '#0A7AA6'; //blue
		 	} else if($.inArray('relig', msg.cats) >= 0) {
		 		cat = 'relig';
		 		//catColor = '#FF8900'; //bright orange
		 	} else if($.inArray('relativ', msg.cats) >= 0) {
		 		cat = 'relativ';
		 		//catColor = '#FFB800'; //yellow
		 	} else if ($.inArray('endPunct', msg.cats) >= 0) {
		 		cat = 'punct';
		 		//catColor = '#FFBE73'; //tan
		 	} else if ($.inArray('leadPunct', msg.cats) >= 0) {
		 		cat = 'punct';
		 		//catColor = '#FFBE73'; //tan
		 	} else if(msg.cats.length === 0) { //not in dictionary
		 		cat = 'nocat';
		 		//catColor = '#F23005'; //red
		 		//console.log('missing word :'+msg.word)
			}		 	
			
		 	var word = this.htmlEncode(msg.word);
		 	
		 	// end punct always followed by space
		 	if($.inArray('endPunct', msg.cats) >= 0){
		 		var s = $('<span class="' + cat + '">' + word + ' ' + '</span>');
				this.$el.find('.blurry_container .transcript').append(s);

				var catColor = $(s).css('color');
				setTimeout(function(e){
					e.css({'color':'transparent', 'text-shadow':'0 0 18px '+ catColor});
				}, 20, s);

				this.lastLeadPunct = false;
				this.lastEndPunct = true;

				//console.log('punct = '+ msg.word);
		 	}
		 	
		 	// lead punct
		 	else if ($.inArray('leadPunct', msg.cats) >= 0){
		 		//no lead space if it follows a sentence end
		 		var s; 
		 		if (this.lastEndPunct) s = $('<span class="' + cat + '">' + word + '</span>');
		 		else s = $('<span class="' + cat + '">' + ' ' + word + '</span>');
		 		this.$el.find('.blurry_container .transcript').append(s);

				var catColor = $(s).css('color');

				setTimeout(function(e){
					e.css({'color':'transparent', 'text-shadow':'0 0 24px '+ catColor});
				}, 20, s);

		 		this.lastLeadPunct = true;
		 		this.lastEndPunct = false;
			}
			// words get a preceeding space, unless they follow lead punct
		 	else {	
		 		
		 		if (!this.lastLeadPunct) this.$el.find('.blurry_container .transcript').append('<span class="space"> </span>');
		 		var s = $('<span class="' + cat + '">' + word + '</span>');
		 		this.$el.find('.blurry_container .transcript').append(s);

				var catColor = $(s).css('color');
			
				setTimeout(function(e){
					e.css({'color':'transparent', 'text-shadow':'0 0 24px '+ catColor});
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