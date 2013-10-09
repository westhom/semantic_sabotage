/*
September 2013.
*/

var freudian_drop = function(id) {
	return {
	
		name: "Freudian Drop",
		author: "Sosolimited",
		defaultURL: "http://www.youtube.com/watch?v=Zg0y7WXZfy0&t=0m0s",
		$el: $('<div class="modeContainer" id="'+id+'"></div>'),
		template: false,

		// INITIALIZE MODE.
		// Do anything you want to do to set up your mode the first time here.
		// This gets called once after the mode is loaded.
		init: function() {
			this.$el.append('<div class="container"></div>');
			this.$el.find('.container').append('<div class="transcript proxima-nova-400 size-48"></div>');
			// attach physics lib for this transform
			$.getScript('./libs/box2d-jquery-master/js/lib/jquery.box2d.min.js', function() { /*console.log('SCRIPT LOADED: box-2D');*/ });
		},

		// ENTER MODE.
		// This gets called each time you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
			// remove the words we appended to .transcript, as for all transforms
			this.$el.find('.container .transcript').empty();
			
			// the elements using Box-2D are cloned at the top HTML level, so we must delete them also.
			// this code is currently in sabotage.js, the only place where this works. But it is a big hack. Must be changed.
			// DOESNT ALWAYS WORK: because it doesnt have enough time to load the script beofre words start falling.
			$.getScript('./libs/box2d-jquery-master/js/lib/jquery.box2d.min.js', function() { /*console.log('SCRIPT LOADED: box-2D');*/ });
		},

		// HANDLE INCOMING word MESSAGE.
		// Called each time a new word is ready. 
		handleWord: function(msg) {
			//console.log('word '+msg.word);
			this.appendWordInContext(msg);
		},
		
		// HANDLE INCOMING sentenceEnd MESSAGE.
		// Called each time a new sentence is complete.
		handleSentenceEnd: function(msg) {
			//console.log('sentenceEnd');	
		},
		
		// HANDLE INCOMING stats MESSAGE.
		// Called with each sentence.
		// Passes a collection of interesting language statistics.
		handleStats: function(msg) {
			//console.log(msg);
		},
		
		// APPEND WORD TO DOM.
		// This is where you insert your words into the DOM.
		appendWordInContext: function(msg) {
			
			// We drop word in 3 places, from left, center, and right sides.
			var word_class = undefined;
			if(msg.cats.length === 0) word_class = 'left_word freudian_drop';  			//green
			else if($.inArray('funct', msg.cats) >= 0) word_class = 'center_word freudian_drop';	//light green
			else if($.inArray('cogmech', msg.cats) >= 0) word_class = 'right_word freudian_drop'; //yellow
			
			// Create the word DOM element.
			var dom_word = $('<span class="' + word_class + '">' + msg.word + ' ' + '</span>');
			
			// For making the word drop towards the left or right a bit. The math is right but it does not affect the words correctly.
			// var x_direction = Math.random() < 0.5 ? 1 : -1;
			// var x_vel = Math.random() * 50 * x_direction;
			// console.log(x_direction);
			// console.log(x_vel);

			// Create physics for those 3 classes of words.
			if ( word_class !== undefined ) {
				// console.log('word class = '+ word_class);

				this.$el.find('.container .transcript').append( dom_word );
				dom_word.box2d({
					'y-velocity': 100, /* everything falls down, default 0 */
					// 'x-velocity': x_vel,
					'density': (msg.word.length * 2), /* think weight (relational to its size) between 0 and n, default 1.5 */
					'restitution': 0.2, /* think: bounciness, from 0 to 1, default 0.4 */
					'friction': 0.5 /* think: slideiness, from 0 to 1, default 0.3 */
				});
			}

			// Box-2D messes with click events and renders the youtube URL text input unclickable. The fix we found is to force focus on it this way.
			$("#ytURL").click(function(){
				this.focus();
			});
			
		},
		// For when we submit a new youtube URL, we must clear old Box-2D words from the screen.
		refresh: function() {
			$('.freudian_drop').remove();

		},
		// For Freudian Drop's Box-2D physics engine : delete the box-2d world on exit. Should find the proper way to reset the world rather than deleting it entirely.
		exit: function() {
			delete Box2D;
			$('.freudian_drop').remove();

		}
	}
};