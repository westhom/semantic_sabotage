var mode = function(id) {

	return {
	
		name: "Oh-Scope",
		defaultURL: "http://www.youtube.com/watch?v=WjuCI2yAVD8",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),	
	
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			this.el.empty();

			var c = document.createElement('div');
			$(c).addClass('container');
			this.el.append(c);

			$(c).append('<div class="marqueeCenter"></div>');
//			$(c).append('<div class="particleCenter"></div>');

		},

		// Handle incoming word message.
		handleWord: function(msg) {
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

			var m = document.createElement('div');
			$(m).append(msg.word);
			$(m).addClass('marquee proxima-nova-700');
			$('#oh-scope .marqueeCenter').append(m);



/*
			var dist = 50 + Math.random() * 400;

			for (var i=0; i<k; i++) {
				s[i] = document.createElement('div');
				$(s[i]).append(msg.word);
				$(s[i]).addClass('COS_particle proxima-nova-700');
				$(s[i]).addClass(cats);
				var beta = i*360/k + alpha;
				$(s[i]).css('-webkit-transform', 'rotateZ(' + beta + 'deg) translateX(0px)');
				$('#COS_center').append(s[i]);
			}
			
			for (var i=0; i<k; i++) {
				var beta = i*360/k + alpha;
				$(s[i]).css('-webkit-transform', 'rotateZ(' + beta + 'deg) translateX(' + dist + 'px)');
				$(s[i]).css('opacity', '0.25');
				$(m).css('z-index', '5');
			}

*/			
			
		}
	}
};