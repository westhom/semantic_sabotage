var mode = function(id) {

	return {
	
		name: "Blur Painting",
		defaultURL: "http://www.youtube.com/watch?v=l26Uq3PX-fk",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		curWordPos: 0,

		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append('<div id="bp_container"></div>');
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
			//console.log('sentenceEnd');	
		},
		
		// Handle incoming stats message.
		handleStats: function(msg) {
			//console.log(msg);
		},
		
		appendWordInContext: function(msg) {
		
		 	// update curSentence
		 	if($.inArray('punct', msg.cats) < 0){

			 	var c;
			 	if($.inArray('affect', msg.cats) >= 0) c = 'blue';
			 	else if($.inArray('cogmech', msg.cats) >= 0) c = 'orange';
			 	else if($.inArray('social', msg.cats) >= 0) c = 'magenta';
			 	else if($.inArray('pronoun', msg.cats) >= 0) c = 'yellowgreen';
			 	else if($.inArray('verb', msg.cats) >= 0) c = 'thistle';		
			 	else if($.inArray('bio', msg.cats) >= 0) c = 'firebrick';					 		 	
			 	else c = 'rgb(40,40,40)';

				var s = $('<div class= "faller proxima-nova-400" style="color:' + c + '; opacity:1; top:0px">' + msg.word + '</div>');

				$(s).css('left', this.curWordPos + 'px');		
				$('#bp_container').append(s);

			 	var windowWidth = $('#bp_container').width();
		 		var wordWidth = $(s).width() + 15;
				var h = 50*msg.word.length;

				setTimeout(function(e){
					e.css({'color':'transparent', 'text-shadow':'0 0 36px '+c,'top':h+'px'});
				}, 20, s);

				var fadeOutTime = 20000;
				if (c === 'rgb(40,40,40)')
						fadeOutTime = 10020;

				setTimeout(function(e){
					e.css({'text-shadow':'0 0 36px transparent'});
				}, fadeOutTime, s);


				this.curWordPos = (this.curWordPos + wordWidth);
				if (this.curWordPos > windowWidth)
					this.curWordPos = 0;

			 	var death = fadeOutTime + 10000;
			 	$(s).on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
			 	function() { 
			 		setTimeout(function(){$(s).remove()},death);
			 	});

			}

		}

	}
};