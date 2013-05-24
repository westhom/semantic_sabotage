var mode = function(id) {

	return {
	
		name: "Stretch",
		defaultURL: "http://www.youtube.com/watch?v=iBVtRPmMZXY",
		el: $('<div class="modeContainer" style="background-color:white" id="'+id+'"></div>'),
		
		curDiv: 0,

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

		 		var w,ww,h,hh;

		 		if (this.curDiv === 0) {
			 		$('#stretch .container').append(s);
			 		w = $(s).width();
			 		ww = $('#stretch .container').width();
			 		h = $(s).height();
			 		hh = $('#stretch .container').height();
			 		this.curDiv = 1;
				} else if (this.curDiv === 1) {
			 		$('#stretch .container2').append(s);
			 		w = $(s).width();
			 		ww = $('#stretch .container2').width();
			 		h = $(s).height();
			 		hh = $('#stretch .container2').height();
			 		this.curDiv = 2;
				} else if (this.curDiv === 2) {
			 		$('#stretch .container3').append(s);
			 		w = $(s).width();
			 		ww = $('#stretch .container3').width();
			 		h = $(s).height();
			 		hh = $('#stretch .container3').height();
			 		this.curDiv = 0;
				}

		 		$(s).css('top','-40%');
		 		$(s).css('-webkit-transform-origin','0% 0%');
		 		$(s).css('-webkit-transform','scale(' + ww/w + ',' + hh/h*1.71 + ')');
		 		window.getComputedStyle(s).WebkitTransform;
		 		$(s).css('-webkit-transition','opacity 3s ease-out, color 1s ease-in');		 		
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