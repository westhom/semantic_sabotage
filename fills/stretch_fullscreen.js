var mode = function(id) {

	return {
	
		name: "Stretch Fullscreen",
		defaultURL: "http://www.youtube.com/watch?v=iBVtRPmMZXY",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {

			var c = document.createElement('div');
			$(c).addClass('container franklin-gothic-condensed');
			this.el.append(c);

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
		 		$('#stretch_fullscreen .container').append(s);
		 		var w = $(s).width();
		 		var ww = $('#stretch_fullscreen .container').width();
		 		var h = $(s).height();
		 		var hh = $('#stretch_fullscreen .container').height();
		 		$(s).css('top','-38.60%');
		 		$(s).css('-webkit-transform-origin','0% 0%');
		 		$(s).css('-webkit-transform','scale(' + ww/w*1.00 + ',' + hh/h*1.70 + ')');
		 		window.getComputedStyle(s).WebkitTransform;
		 		$(s).css('-webkit-transition','opacity 3s ease-out, color 1s ease-in');		 		
		 		$(s).css('color', 'rgb(' + Math.floor(Math.random()*200) + ',' + Math.floor(Math.random()*200) + ',' + Math.floor(Math.random()*200) + ')');
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