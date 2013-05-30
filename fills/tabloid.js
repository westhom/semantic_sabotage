var mode = function(id) {

	return {
	
		name: "Tabloid",
		//defaultURL: "http://www.youtube.com/watch?v=ORxR5E7GXh4",
		defaultURL: "http://www.youtube.com/watch?v=EOCcFcgRcTg",
		el: $('<div class="modeContainer" style="background-color:white" id="'+id+'"></div>'),
		
		curDiv: 1,

		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {

			var c = document.createElement('div');
			$(c).addClass('container franklin-gothic-condensed');
			this.el.append(c);

			var c2 = document.createElement('div');
			$(c2).addClass('container2 franklin-gothic-condensed');
			this.el.append(c2);

			var c3 = document.createElement('div');
			$(c3).addClass('container3 franklin-gothic-condensed');
			this.el.append(c3);
			
			var c4 = document.createElement('div');
			$(c4).addClass('container4 franklin-gothic-condensed');
			this.el.append(c4);

			var c5 = document.createElement('div');
			$(c5).addClass('container5 franklin-gothic-condensed');
			this.el.append(c5);

			var c6 = document.createElement('div');
			$(c6).addClass('container6 franklin-gothic-condensed');
			this.el.append(c6);

			var c7 = document.createElement('div');
			$(c7).addClass('container7 franklin-gothic-condensed');
			this.el.append(c7);

			var c8 = document.createElement('div');
			$(c8).addClass('container8 franklin-gothic-condensed');
			this.el.append(c8);			
			
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
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

		 	if($.inArray('punct', msg.cats) < 0){

		 		var s = document.createElement('div');
		 		$(s).addClass('word');
		 		$(s).append(msg.word);

		 		var w,h,ww,hh;

		 		if (this.curDiv === 1) {
			 		this.el.find('.container').append(s);
			 		w = $(s).width();
			 		ww = this.el.find('.container').width();
			 		h = $(s).height();
			 		hh = this.el.find('.container').height();
			 		this.curDiv = 2;
				} else if (this.curDiv === 2) {
			 		this.el.find('.container2').append(s);
			 		w = $(s).width();
			 		ww = this.el.find('.container2').width();
			 		h = $(s).height();
			 		hh = this.el.find('.container2').height();
			 		this.curDiv = 3;
				} else if (this.curDiv === 3) {
			 		this.el.find('.container3').append(s);
			 		w = $(s).width();
			 		ww = this.el.find('.container3').width();
			 		h = $(s).height();
			 		hh = this.el.find('.container3').height();
			 		this.curDiv = 4;
				} else if (this.curDiv === 4) {
			 		this.el.find('.container4').append(s);
			 		w = $(s).width();
			 		ww = this.el.find('.container4').width();
			 		h = $(s).height();
			 		hh = this.el.find('.container4').height();
			 		this.curDiv = 5;
				} else if (this.curDiv === 5) {
			 		this.el.find('.container5').append(s);
			 		w = $(s).width();
			 		ww = this.el.find('.container5').width();
			 		h = $(s).height();
			 		hh = this.el.find('.container5').height();
			 		this.curDiv = 6;
				} else if (this.curDiv === 6) {
			 		this.el.find('.container6').append(s);
			 		w = $(s).width();
			 		ww = this.el.find('.container6').width();
					h = $(s).height();
			 		hh = this.el.find('.container6').height();
			 		this.curDiv = 7;
				} else if (this.curDiv === 7) {
			 		this.el.find('.container7').append(s);
			 		w = $(s).width();
			 		ww = this.el.find('.container7').width();
			 		h = $(s).height();
			 		hh = this.el.find('.container7').height();
			 		this.curDiv = 8;
				} else if (this.curDiv === 8) {
			 		this.el.find('.container8').append(s);
			 		w = $(s).width();
			 		ww = this.el.find('.container8').width();
			 		h = $(s).height();
			 		hh = this.el.find('.container8').height();
			 		this.curDiv = 1;
				}


		 		$(s).css('top','-40%');
		 		$(s).css('-webkit-transform-origin','0% 0%');
		 		$(s).css('-webkit-transform','scale(' + ww/w + ',' + hh/h*1.71 + ')');
		 		window.getComputedStyle(s).WebkitTransform;
		 		$(s).css('-webkit-transition','opacity 1.5s ease-out, color 1s ease-in');		 		
		 		//$(s).css('color', 'rgb(' + Math.floor(Math.random()*200) + ',' + Math.floor(Math.random()*200) + ',' + Math.floor(Math.random()*200) + ')');
		 		$(s).css('opacity','0');		 		

		 		var death = 3000;
		 		$(s).on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
		 			function() { 
		 				setTimeout(function(){$(s).remove()},death);
		 			});


		 	}
		}
	}
};