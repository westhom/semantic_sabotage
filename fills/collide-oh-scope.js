var mode = function(id) {

	return {
	
		name: "Collide-Oh-Scope (re-unbusted)",
		defaultURL: "http://www.youtube.com/watch?v=E4mx2P3kLv4",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append('<div id="COS_container"><div id="COS_center"></div><div id="COS_marqueeContainer"></div></div>');
		},

		// Gets called evertime you go to the mode.
		enter: function() {
		},

		// Handle incoming word message.
		handleWord: function(msg) {
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

			var m = document.createElement('div');
			$(m).append(msg.word);
			$(m).addClass('COS_marquee proxima-nova-700');
			$('#COS_marqueeContainer').append(m);

			/*
			pronoun
			article
			verb
			adverb
			*/

			var cats = ' ';
			if ($.inArray('pronoun', msg.cats) >= 0) {
				cats = cats + 'pronoun ';
			}
			if ($.inArray('article', msg.cats) >= 0) {
				cats = cats + 'article ';
			}
			if ($.inArray('verb', msg.cats) >= 0) {
				cats = cats + 'verb ';
			}
			if ($.inArray('adverb', msg.cats) >= 0) {
				cats = cats + 'adverb ';
			}

			var k = 3;
			var s = [];

			var alpha = Math.random() * 180/k; /* <360 for gaps */
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
			
			window.getComputedStyle(s[k-1]).WebkitTransform;
			
			for (var i=0; i<k; i++) {
				var beta = i*360/k + alpha;
				$(s[i]).css('-webkit-transform', 'rotateZ(' + beta + 'deg) translateX(' + dist + 'px)');
				$(s[i]).css('opacity', '0.25');
				$(m).css('z-index', '5');
			}

			$(m).css('opacity', '0.05');
			$(m).css('color', 'black');
			
		}
	}
};