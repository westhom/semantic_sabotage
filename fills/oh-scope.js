var mode = function(id) {

	return {
	
		name: "Oh-Scope",
		defaultURL: "http://www.youtube.com/watch?v=WjuCI2yAVD8",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),	

		storeID: 'empty',
		storeClass: 'empty',
		radius: 500,
		period: 30,
	
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			this.el.empty();

			var c = document.createElement('div');
			$(c).addClass('container');
//			$(c).css('background-color','#666');
			$(c).css('background-image','-webkit-gradient(radial, center center, ' + (this.radius) + ', center center, ' + (this.radius+10) + ', color-stop(0, #666), color-stop(1, #000))');
			this.el.append(c);


			$(c).append('<div class="marqueeCenter"></div>');

			$('#oh-scope .marqueeCenter').css('width', this.radius+'px')

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

//			console.log('word: '+msg.word);

			if (this.storeID[0] == '[') {
				this.storeID = this.storeID + msg.word;
			}

			if (msg.word == ']:' ) {
				if (this.storeID.search('Tower') >= 0) this.storeClass = 'tower';
				if (this.storeID.search('AirFrance') >= 0) this.storeClass = 'airfrance';
				if (this.storeID.search('Comair') >= 0) this.storeClass = 'comair';
				console.log('storeID: ' + this.storeID + ' -- storeClass: ' + this.storeClass);
				this.storeID = 'empty';
			}

			if (this.storeID.search('unintell') >=0) {
				msg.word = '[unintelligible]';
				this.storeID = 'empty';
			}

			if (this.storeID == 'empty') {
				if (msg.word == '[') {
					this.storeID = msg.word;
				}
				else if ($.inArray('punct', msg.cats) < 0) {
					var m = document.createElement('div');
					$(m).append(msg.word);
					$(m).addClass('marquee proxima-nova-700');
					$('#oh-scope .marqueeCenter').append(m);

					setTimeout( function() { $(m).remove() }, this.period*1000 );

//					var r = 10;
//					var r = 10 + this.radius-75-10;
					var r = 10 + Math.round(Math.random()*(this.radius-75-10));
					var p = document.createElement('div');
					console.log(msg.word);
					console.log(msg.cats);
					console.log(msg.stat)
					$(p).append(msg.word);
					$(p).addClass('particle ' + this.storeClass + ' proxima-nova-400');
					$(p).css('left', r +'px');
					$(p).css('-webkit-transform-origin', -r/10 + '% 50%');
					$('#oh-scope .marqueeCenter').append(p);
				}
				
			}			
		}
	}
};