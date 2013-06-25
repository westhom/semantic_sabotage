var tabloid = function(id) {

	return {
	
		name: "Tabloid",
		author: "Sosolimited",
		
		defaultURL: "http://www.youtube.com/watch?v=EOCcFcgRcTg&t", //America by Allen Ginsberg
		el: $('<div class="modeContainer" style="background-color:white" id="'+id+'"></div>'),
		curDiv: 1,

		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {

			this.el.empty();
			
			var b = this.el;
			//create and add the 8 containers
			for (var i=0; i<8; i++) {
				var c = document.createElement('div');
				$(c).addClass('container' + (i+1) + ' franklin-gothic-condensed');
				$(b).append(c);
			};

		},

		// Gets called evertime you go to the mode.
		enter: function() {

			//clear out all the divs of any lingering words
			for (var i=0; i<8; i++) {
				$('#container'+(i+1)).empty();			
			};

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
		
		 	// update curSentence
		 	// ignore punctuation messages. just want words
		 	if($.inArray('punct', msg.cats) < 0){

		 		var s = document.createElement('div');
		 		$(s).addClass('word');
		 		$(s).append(msg.word);

		 		var w,h,ww,hh;

		 		//find which div you're current word is going to go in
			 	this.el.find('.container'+this.curDiv).append(s);

			 	//get current word and current div width, so you can smoosh it into shape later
			 	w = $(s).width();
			  ww = this.el.find('.container'+this.curDiv).width();
			 	h = $(s).height();
			 	hh = this.el.find('.container'+this.curDiv).height();

		 		$(s).css('top','-40%');
		 		$(s).css('-webkit-transform-origin','0% 0%');
		 		$(s).css('-webkit-transform','scale(' + ww/w + ',' + hh/h*1.71 + ')'); //smoosh word into div to fill it up
		 		window.getComputedStyle(s).WebkitTransform;
		 		$(s).css('-webkit-transition','opacity 1.5s ease-out, color 1s ease-in');	//setup word fade out 		
		 		$(s).css('opacity','0');		 		

		 		//remove words after 3000ms
 		 		var death = 3000;
		 		$(s).on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
		 			function() { 
		 				setTimeout(function(){$(s).remove()},death);
		 			});

				//increment which div you're filling next 
			 	this.curDiv++;

			 	//wrap back to 1st div every 8 words
			 	if (this.curDiv > 8)
			 		this.curDiv = 1;

		 	}
		}
	}
};