var mode = function(id) {

	return {
	
		name: "Shatter",
		defaultURL: "http://www.youtube.com/watch?v=mox4InKEwgU&t=0m6s",
		el: $('<div class="modeContainer" style="background-color:black" id="'+id+'"></div>'),

		tFall: 1,
		tSpread: 3,
		tFade: 15, // Greater than this.tSpread
		tColor: 0.5,
		radius: (Math.max($(window).width(),$(window).height()))*0.5,
		viewScalar: 1,
		widthScalar: 20,
		fontHeight: 100,
		fallStart: 500,
		fallEnd: 0,
		letterCounts: [],

		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append('<div id="shatContainer"></div>');
			$('#shatContainer').css('-webkit-transform','perspective(' + $(window).width() + 'px)');
			this.el.append('<span id="shatShell"></span>');
			$('#shatShell').addClass('museo-slab-500');

			for (var i = 0; i < 200 ; i++)
				this.letterCounts[i] = 0;
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

				$('#shatContainer').css('-webkit-transform','perspective(' + $(window).width() + 'px)');

				var m = document.createElement('div');
				$(m).addClass('morter museo-slab-500');

				var p = [];
				var charVal = [];
				var w = 0;
				
				for (var i = 0; i < msg.word.length; i++) {

					$('#shatShell').empty();
					$('#shatShell').append(msg.word[i]);
					var width = $('#shatShell').width();

					var ph = document.createElement('span');
					$(ph).addClass('particleHolder');
					
					p[i] = document.createElement('span');
					$(p[i]).addClass('particle');
					$(p[i]).css('width', width);
					$(p[i]).css('-webkit-transform','translateX(' + w + 'px)');
					$(p[i]).append(msg.word[i]);

					$(ph).append(p[i]);

					//Letter 'A' == charCode 65
					charVal[i] = msg.word[i].charCodeAt() - 65;
					if (charVal[i] < 0)
						charVal[i] = 0; //don't want negative array positions 
					if (charVal[i] > 31)
						charVal[i] = charVal[i] - 32; //make 'a' be same as 'A'

					//increment # of times you've seen the letter
					this.letterCounts[charVal[i]]++;

					//if letters drip off-screen, reset count to put them back on top
					if (this.letterCounts[charVal[i]] > 100)
						this.letterCounts[charVal[i]] = 0;
					
					$(m).append(ph);

					w = w + width;

				};

				$(m).css('-webkit-transform','translate3d(' + (-w/2) + 'px,' + (this.radius-this.fontHeight*2/3) + 'px,' + this.fallStart + 'px)');
			 	$('#shatContainer').append(m);
				
				window.getComputedStyle(m).WebkitTransform;

				$(m).css('-webkit-transition','-webkit-transform ' + this.tFall + 's ease-in, color ' + this.tColor + 's linear');
				$(m).css('-webkit-transform','translate3d(' + (-w/2) + 'px,' + (-this.fontHeight*2/3) + 'px,' + this.fallEnd + 'px)');
				//$(m).css('color', 'rgb(' + Math.floor(Math.random()*150) + ',' + Math.floor(Math.random()*150) + ',' + Math.floor(Math.random()*150) + ')');

				for (var i = 0; i < msg.word.length; i++) {
					$(p[i]).css('-webkit-transition', '-webkit-transform ' + this.tSpread + 's ease-out, opacity ' + this.tFade + 's linear');
					//var alpha = Math.random()*360 - 180;
					var alpha = charVal[i] ;
					var beta = Math.random()*360;
					var dist = this.radius*(0.75 + 0.25*Math.random());
					var xSpread = w/2 -0.85*this.radius+alpha*55;
					var yPos = -0.66*this.radius + this.letterCounts[alpha]*15;
					$(p[i]).css('-webkit-transition-delay',this.tFall + 's');
					$(p[i]).css('-webkit-transform', 'translate3d(' + xSpread + 'px,' + yPos + 'px,0px) rotateZ(360deg)' );
					$(p[i]).css('opacity', '0');
				};

				var death = (this.tFall + this.tFade)*1000;
				$(m).on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
					function() { 
						setTimeout(function(){$(m).remove()},death);
					});
			}
		}
	}
};