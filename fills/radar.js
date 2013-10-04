var radar = function(id) {

	return {
	
		name: "Radar",
		author: "Sosolimited",
		
		defaultURL: "http://www.youtube.com/watch?v=WjuCI2yAVD8", //air traffic conversation.
		
		$el: $('<div class="modeContainer" id="'+id+'"></div>'),	

		storeID: 'empty', // creates this.storeID to keep track of speaker IDs in the trasncript
		storeClass: 'tower', // defaults to "tower" class (i.e. control tower)
		period: 30, // period of the radar swing in seconds -- if this is changed, -webkit-animation duration settings should be changed accordingly in radar.css
		radius: 1, // active radar radius -- gets reset below based on window width and height
		ringCount: 5, // sets number of radial divisions
		ringRatio: new Array(), // used to store values for radial division scaling

		lineStroke: 2, // line thickness
		drift: 1, // movement bounds for drifting objects -- gets reset below based on window width and height
	
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {

			this.$el.empty(); // empty modeContainer div for setup

		},

		// Gets called evertime you go to the mode.
		enter: function() {

			this.$el.empty(); // empty modeContainer div for setup

			this.$el.append('<div class="container"></div>'); // create container div within modeContainer

			this.radius = Math.min(this.$el.width(),this.$el.height())/2*0.95; // set radar radius
			this.drift = this.radius * 0.15; // set particle drift

			this.$el.find('.container').append('<div class="ringCenter"></div>'); // create central anchor to contain graphical elements

			// setup graphical elements
			for (var i=this.ringCount; i>0; i--) { 
				this.ringRatio[i] = i/(this.ringCount);
				console.log(this.ringRatio[i]);
				this.$el.find('.ringCenter').append('<div class="ring1" style="left:' +(-this.radius*this.ringRatio[i])+ 'px; top:' +(-this.radius*this.ringRatio[i])+ 'px; width:' +(this.radius*this.ringRatio[i]*2)+ 'px; height:' +(this.radius*this.ringRatio[i]*2)+ 'px;"></div>');
				this.$el.find('.ringCenter').append('<div class="ring2" style="left:' +(-this.radius*this.ringRatio[i]+this.lineStroke)+ 'px; top:' +(-this.radius*this.ringRatio[i]+this.lineStroke)+ 'px; width:' +(this.radius*this.ringRatio[i]-this.lineStroke)*2+ 'px; height:' +(this.radius*this.ringRatio[i]-this.lineStroke)*2+ 'px;"></div>');
			}

			this.$el.find('.ringCenter').append('<div class="line" style="left:' +(-this.lineStroke/2)+ 'px; top:' +(-this.radius*this.ringRatio[this.ringCount])+ 'px; width:' +this.lineStroke+ 'px; height:' +(this.radius*this.ringRatio[this.ringCount]*2)+ 'px;"></div>');
			this.$el.find('.ringCenter').append('<div class="line" style="left:' +(-this.radius*this.ringRatio[this.ringCount])+ 'px; top:' +(-this.lineStroke/2)+ 'px; width:' +(this.radius*this.ringRatio[this.ringCount]*2)+ 'px; height:' +this.lineStroke+ 'px;"></div>');
			// end setup graphical elements

			this.$el.find('.container').append('<div class="timer"></div>'); // set up "mechanical timer" (driven by -webkit-animation cycle and referenced to synchronize time within animation)
			this.$el.find('.container').append('<div class="marqueeCenter"></div>'); // set up central div to anchor radar line and associated text (rel to center)
			this.$el.find('.container').append('<div class="particleCenter"></div>'); // set up central div to achor particle placement within container (rel to center)

			this.$el.find('.marqueeCenter').css('width', (this.radius*this.ringRatio[this.ringCount])+'px'); // set marqueeCenter width to establish length of radar line

		},

		// Handle incoming word message.
		handleWord: function(msg) {
			this.appendWordInContext(msg);
		},
		
		// Handle incoming sentenceEnd message.
		handleSentenceEnd: function(msg) {
		},
		
		// Handle incoming stats message.
		handleStats: function(msg) {
		},
		
		appendWordInContext: function(msg) {



			if (this.storeID[0] == '[') { // speaker IDs are notated within brackets. this checks to see if a bracket has been opened for tracking.
				this.storeID = this.storeID + msg.word; // collects words to this.storeID when brackets are open.
			}

			// checks for closing brackets with colon (this is the speaker notation for this video) and updates this.storeClass with appropriate flag for speaker.
			if (msg.word == ']:' ) { 
				if (this.storeID.search('Tower') >= 0) this.storeClass = 'tower';
				if (this.storeID.search('AirFrance') >= 0) this.storeClass = 'airfrance';
				if (this.storeID.search('Comair') >= 0) this.storeClass = 'comair';
				this.storeID = 'empty'; // empties this.storeID to prepare for next open bracket.
			}

			// checks for bracketed "[unintelligible]" noting unintelligible speach within closed captions. resets this.storeID.
			if (this.storeID.search('unintell') >=0) {
				msg.word = '[unintelligible]';
				this.storeID = 'empty';
			}

			// when this.storeID is empty, messages are part of the spoken text
			if (this.storeID == 'empty') {
				if (msg.word == '[') { // checks to make sure that message is not starting a new speaker ID
					this.storeID = msg.word;
				}
				else if ($.inArray('punct', msg.cats) < 0) { // checks for punctuation, which is omitted from display in this transform
					
					// creates to dive to hold fading "sweeper" text which act as the radar line trail.
					// attaches marquee and font classes. appends to marqueeCenter. sets timeout function to cull div after fading.
					var m = document.createElement('div');
					$(m).append(msg.word);
					$(m).addClass('marquee proxima-nova-700');
					$(m).css('font-size', (this.radius*0.11)+'px'); // set font size of radial trail to fit "[unintelligible]""
					this.$el.find('#radar .marqueeCenter').append(m);
					setTimeout( function() { $(m).remove() }, this.period*1000 );

					var angle = -$('#radar .timer').width()/10 * Math.PI/180; // calculates radar angle by referencing the animated timer object (to sync particle placement with animated radar position)

					var rMin = this.radius*this.ringRatio[this.ringCount-1]; // sets minimum radius for particle placement
					var rMax = this.radius*this.ringRatio[1]; // sets maximium radius for particle placement
					
					// sets radial distance from rMin for particle placement
					var rDelta = Math.round(Math.random()*(rMax-rMin));
					var r = rMin + rDelta;

					// calculates x and y coordinates for particle placement
					var x = Math.round(Math.cos(angle) * r);
					var y = Math.round(Math.sin(angle) * r);

					// creates and particle div and establishes placement location
					var p = document.createElement('div');
					$(p).addClass('particle ' + this.storeClass );
					$(p).css('transform','translate(' + x + 'px, ' + y + 'px)');
					$(p).css('-webkit-transform','translate(' + x + 'px, ' + y + 'px)');

					// creates word object with appended message for eventual placement into the particle object
					var w = document.createElement('div');
					$(w).addClass('word');
					$(w).append(msg.word);

					// creates graphical "dot" object to act as a marker for particle position
					var d = document.createElement('div');
					$(d).addClass('dot');
					$(d).append('&#8853;');

					// appends marker and word objects to particle object
					$(p).append(d);
					$(p).append(w);

					// attaches particle object to particleCenter and sets timeout function to cull objects following animation
					$('#radar .particleCenter').append(p);
					setTimeout( function() { $(p).remove() }, this.period*1000 );

					window.getComputedStyle(p).WebkitTransform; // forces DOM to calculate position of particle object to ensure initial position before css -webkit-transition activity (particle drift)

					// calculates random x and y drift for each particle and initiates the -webkit-transition activity
					var dx = Math.round(this.drift-Math.random()*this.drift*2);
					var dy = Math.round(this.drift*2-Math.random()*this.drift*2*2);
					$(p).css('left',+ dx + 'px');
					$(p).css('top',+ dy + 'px');

				}				
			}			
		}
	}
};