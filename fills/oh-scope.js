var mode = function(id) {

	return {
	
		name: "Radar",
		defaultURL: "http://www.youtube.com/watch?v=WjuCI2yAVD8",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),	

		storeID: 'empty',
		storeClass: 'tower',
		radius: 500,
		period: 30,
	
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {

			this.el.empty();

		},

		// Gets called evertime you go to the mode.
		enter: function() {

			this.el.empty();
			this.timer = 0;

			this.el.append('<div class="container"></div>');

//			$('#oh-scope .container').css('background-image','-webkit-gradient(radial, center center, ' + (this.radius) + ', center center, ' + (this.radius+10) + ', color-stop(0, #666), color-stop(1, #000))');

			$('#oh-scope .container').append('<div class="ring1" style="left:' +($('#oh-scope .container').width()-(this.radius)*10/5)/2+ 'px; top:' +($('#oh-scope .container').height()-(this.radius)*10/5)/2+ 'px; width:' +(this.radius)*10/5+ 'px; height:' +(this.radius)*10/5+ 'px;"></div>');
			$('#oh-scope .container').append('<div class="ring2" style="left:' +(($('#oh-scope .container').width()-(this.radius)*10/5)/2+2)+ 'px; top:' +(($('#oh-scope .container').height()-(this.radius)*10/5)/2+2)+ 'px; width:' +((this.radius)*10/5-4)+ 'px; height:' +((this.radius)*10/5-4)+ 'px;"></div>');

			$('#oh-scope .container').append('<div class="ring1" style="left:' +($('#oh-scope .container').width()-(this.radius)*6/5)/2+ 'px; top:' +($('#oh-scope .container').height()-(this.radius)*6/5)/2+ 'px; width:' +(this.radius)*6/5+ 'px; height:' +(this.radius)*6/5+ 'px;"></div>');
			$('#oh-scope .container').append('<div class="ring2" style="left:' +(($('#oh-scope .container').width()-(this.radius)*6/5)/2+2)+ 'px; top:' +(($('#oh-scope .container').height()-(this.radius)*6/5)/2+2)+ 'px; width:' +((this.radius)*6/5-4)+ 'px; height:' +((this.radius)*6/5-4)+ 'px;"></div>');

			$('#oh-scope .container').append('<div class="ring1" style="left:' +($('#oh-scope .container').width()-(this.radius)*2/5)/2+ 'px; top:' +($('#oh-scope .container').height()-(this.radius)*2/5)/2+ 'px; width:' +(this.radius)*2/5+ 'px; height:' +(this.radius)*2/5+ 'px;"></div>');
			$('#oh-scope .container').append('<div class="ring2" style="left:' +(($('#oh-scope .container').width()-(this.radius)*2/5)/2+2)+ 'px; top:' +(($('#oh-scope .container').height()-(this.radius)*2/5)/2+2)+ 'px; width:' +((this.radius)*2/5-4)+ 'px; height:' +((this.radius)*2/5-4)+ 'px;"></div>');

			$('#oh-scope .container').append('<div class="timer"></div>');
			$('#oh-scope .container').append('<div class="marqueeCenter"></div>');
			$('#oh-scope .container').append('<div class="particleCenter"></div>');

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

			if (this.storeID[0] == '[') {
				this.storeID = this.storeID + msg.word;
			}

			if (msg.word == ']:' ) {
				if (this.storeID.search('Tower') >= 0) this.storeClass = 'tower';
				if (this.storeID.search('AirFrance') >= 0) this.storeClass = 'airfrance';
				if (this.storeID.search('Comair') >= 0) this.storeClass = 'comair';
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

					var angle = -$('#oh-scope .timer').width()/10 * Math.PI/180;
					var r = 100 + Math.round(Math.random()*(this.radius-75-100)) - Math.round(Math.cos(angle) * 50);
					var dx = Math.round(Math.cos(angle) * r);
					var dy = Math.round(Math.sin(angle) * r);
					console.log(dx + ',' + dy);

					var p = document.createElement('div');
					$(p).addClass('particle ' + this.storeClass + ' proxima-nova-400');
					$(p).css('-webkit-transform','translate(' + dx + 'px, ' + dy + 'px)');

					var w = document.createElement('div');
					$(w).addClass('word');
					$(w).append(msg.word);

					var d = document.createElement('div');
					$(d).addClass('dot');
					$(d).append('.');

					$(p).append(d);
					$(p).append(w);

					$('#oh-scope .particleCenter').append(p);
					setTimeout( function() { $(p).remove() }, this.period*1000 );
					window.getComputedStyle(p).WebkitTransform;

					var deltax = Math.round(25-Math.random()*25*2);
					var deltay = Math.round(50-Math.random()*50*2);

					$(p).css('left',+ deltax + 'px');
					$(p).css('top',+ deltay + 'px');

				}				
			}			
		}
	}
};