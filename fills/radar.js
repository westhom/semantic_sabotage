var mode = function(id) {

	return {
	
		name: "Radar",
		defaultURL: "http://www.youtube.com/watch?v=WjuCI2yAVD8",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),	

		storeID: 'empty',
		storeClass: 'tower',
		radius: 500,
		buffer: 50,
		period: 30,
		ringRatio1: 10/5,
		ringRatio2: 7.5/5,
		ringRatio3: 5/5,
		ringRatio4: 2.5/5,
		ringStroke: 2,
		floatx: 25,
		floaty: 50,

	
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

			var divWidth = this.el.find('.container').width();
			var divHeight = this.el.find('.container').height();

			this.el.find('.container').append('<div class="ring1" style="left:' +(divWidth-(this.radius)*this.ringRatio1)/2+ 'px; top:' +(divHeight-(this.radius)*this.ringRatio1)/2+ 'px; width:' +(this.radius)*this.ringRatio1+ 'px; height:' +(this.radius)*this.ringRatio1+ 'px;"></div>');
			this.el.find('.container').append('<div class="ring2" style="left:' +((divWidth-(this.radius)*this.ringRatio1)/2+this.ringStroke)+ 'px; top:' +((divHeight-(this.radius)*this.ringRatio1)/2+this.ringStroke)+ 'px; width:' +((this.radius)*this.ringRatio1-2*this.ringStroke)+ 'px; height:' +((this.radius)*this.ringRatio1-2*this.ringStroke)+ 'px;"></div>');

			this.el.find('.container').append('<div class="ring1" style="left:' +(divWidth-(this.radius-this.buffer)*this.ringRatio1)/2+ 'px; top:' +(divHeight-(this.radius-this.buffer)*this.ringRatio1)/2+ 'px; width:' +(this.radius-this.buffer)*this.ringRatio1+ 'px; height:' +(this.radius-this.buffer)*this.ringRatio1+ 'px;"></div>');
			this.el.find('.container').append('<div class="ring2" style="left:' +((divWidth-(this.radius-this.buffer)*this.ringRatio1)/2+this.ringStroke)+ 'px; top:' +((divHeight-(this.radius-this.buffer)*this.ringRatio1)/2+this.ringStroke)+ 'px; width:' +((this.radius-this.buffer)*this.ringRatio1-2*this.ringStroke)+ 'px; height:' +((this.radius-this.buffer)*this.ringRatio1-2*this.ringStroke)+ 'px;"></div>');

			this.el.find('.container').append('<div class="ring1" style="left:' +(divWidth-(this.radius-this.buffer)*this.ringRatio2)/2+ 'px; top:' +(divHeight-(this.radius-this.buffer)*this.ringRatio2)/2+ 'px; width:' +(this.radius-this.buffer)*this.ringRatio2+ 'px; height:' +(this.radius-this.buffer)*this.ringRatio2+ 'px;"></div>');
			this.el.find('.container').append('<div class="ring2" style="left:' +((divWidth-(this.radius-this.buffer)*this.ringRatio2)/2+this.ringStroke)+ 'px; top:' +((divHeight-(this.radius-this.buffer)*this.ringRatio2)/2+this.ringStroke)+ 'px; width:' +((this.radius-this.buffer)*this.ringRatio2-2*this.ringStroke)+ 'px; height:' +((this.radius-this.buffer)*this.ringRatio2-2*this.ringStroke)+ 'px;"></div>');

			this.el.find('.container').append('<div class="ring1" style="left:' +(divWidth-(this.radius-this.buffer)*this.ringRatio3)/2+ 'px; top:' +(divHeight-(this.radius-this.buffer)*this.ringRatio3)/2+ 'px; width:' +(this.radius-this.buffer)*this.ringRatio3+ 'px; height:' +(this.radius-this.buffer)*this.ringRatio3+ 'px;"></div>');
			this.el.find('.container').append('<div class="ring2" style="left:' +((divWidth-(this.radius-this.buffer)*this.ringRatio3)/2+this.ringStroke)+ 'px; top:' +((divHeight-(this.radius-this.buffer)*this.ringRatio3)/2+this.ringStroke)+ 'px; width:' +((this.radius-this.buffer)*this.ringRatio3-2*this.ringStroke)+ 'px; height:' +((this.radius-this.buffer)*this.ringRatio3-2*this.ringStroke)+ 'px;"></div>');

			this.el.find('.container').append('<div class="ring1" style="left:' +(divWidth-(this.radius-this.buffer)*this.ringRatio4)/2+ 'px; top:' +(divHeight-(this.radius-this.buffer)*this.ringRatio4)/2+ 'px; width:' +(this.radius-this.buffer)*this.ringRatio4+ 'px; height:' +(this.radius-this.buffer)*this.ringRatio4+ 'px;"></div>');
			this.el.find('.container').append('<div class="ring2" style="left:' +((divWidth-(this.radius-this.buffer)*this.ringRatio4)/2+this.ringStroke)+ 'px; top:' +((divHeight-(this.radius-this.buffer)*this.ringRatio4)/2+this.ringStroke)+ 'px; width:' +((this.radius-this.buffer)*this.ringRatio4-2*this.ringStroke)+ 'px; height:' +((this.radius-this.buffer)*this.ringRatio4-2*this.ringStroke)+ 'px;"></div>');

			this.el.find('.container').append('<div class="timer"></div>');
			this.el.find('.container').append('<div class="marqueeCenter"></div>');
			this.el.find('.container').append('<div class="particleCenter"></div>');

			this.el.find('.marqueeCenter').css('width', this.radius+'px')

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
					$('#radar .marqueeCenter').append(m);
					setTimeout( function() { $(m).remove() }, this.period*1000 );

					var angle = -$('#radar .timer').width()/10 * Math.PI/180;

					var rMin = this.ringRatio4*(this.radius-this.buffer)/2;
					var rMax = (this.radius-this.buffer);
					var rDelta = Math.round(Math.random()*(rMax-rMin));

					var r = rMin + rDelta;

					var x = Math.round(Math.cos(angle) * r);
					var y = Math.round(Math.sin(angle) * r);

					var p = document.createElement('div');
					$(p).addClass('particle ' + this.storeClass + ' proxima-nova-400');
					$(p).css('-webkit-transform','translate(' + x + 'px, ' + y + 'px)');

					var w = document.createElement('div');
					$(w).addClass('word');
					$(w).append(msg.word);

					var d = document.createElement('div');
					$(d).addClass('dot');
					$(d).append('.');

					$(p).append(d);
					$(p).append(w);

					$('#radar .particleCenter').append(p);
					setTimeout( function() { $(p).remove() }, this.period*1000 );
					window.getComputedStyle(p).WebkitTransform;

					var dx = Math.round(this.floatx-Math.random()*this.floatx*2);
					var dy = Math.round(this.floaty-Math.random()*this.floaty*2);

					$(p).css('left',+ dx + 'px');
					$(p).css('top',+ dy + 'px');

				}				
			}			
		}
	}
};