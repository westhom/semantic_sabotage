var mode = function(id) {

	return {
	
		name: "Mad Lib",
		defaultURL: "http://www.youtube.com/watch?v=u02nZW0QiSE",
		//el: $('<div class="modeContainer" id="'+this.name+'"></div>'),
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		lastLeadPunct: 0,
		lastEndPunct: 0,
		timeoutEvents: [],
		buildSentence: true,
		sentenceCount: 0,
		sentenceWordCount: 0,

				 
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append('<div id="madlib" class="container bg-white"></div>');

		},

		// Gets called evertime you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
			
			$('#madlib').empty();
			this.buildSentence = true;

			var holder = $('<div class="sentence franklin-gothic-condensed"></div>');
			$('#madlib').append(holder);
			
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

		htmlEncode: function(value){
  			//create a in-memory div, set it's inner text(which jQuery automatically encodes)
  			//then grab the encoded contents back out.  The div never exists on the page.
  			return $('<div/>').text(value).html();
		},

		clearTimeoutEvents: function(type) {
	    for (var i=0; i<this.timeoutEvents.length; i++) {
		    clearTimeout(this.timeoutEvents[i]);
	    };
    },

    setWordPositions: function(words) {
    	//words is a jQuery collection
    	//console.log('set word pos');
    	var x = 100;
    	var space_width = 36;
    	words.each(function(i) {
    		
    		$(this).css("left", x);
    		x += $(this).outerWidth();
    		x += space_width;
    		console.log(i + ' ' + $(this).html() + ' '  + $(this).outerWidth());
    	});
    },
		
		appendWordInContext: function(msg) {
			
			//BUILD a SENTENCE
			if (this.buildSentence)
			{
				//ignore any punctuation
				if($.inArray('punct', msg.cats) < 0)
				{
					var el = $('<div class="landing-word">' + msg.word.toUpperCase() + '</div>');
					//console.log('New Word:');
					for (i in msg.cats)
					{
						//console.log(msg.cats[i]);
						if ((msg.cats[i] != 'funct') && (msg.cats[i] != 'pronoun') && (msg.cats[i] != 'sentencesmode')) {
							el.addClass(msg.cats[i]);
							//console.log('Category ' + msg.cats[i]);
						}
					}

					el.css('left', $('#madlib').width());
					el.css('top', '200px');

					$('.sentence').append(el);
					//$('.sentence').append('<div class="space-word">&nbsp</div>');

					this.sentenceWordCount++;
				}
				/*
				else if ($.inArray('endPunct', msg.cats) >= 0)
				{
					if ((msg.word == '.') || (msg.word == '!') || (msg.word == '?')) {
						this.buildSentence = false;
						this.sentenceCount = 0;
					}
				}
				*/
				//Instead of using punctuation, use word count to cap the number of word objects
				if (this.sentenceWordCount > 5)
				{
					this.buildSentence = false;
					this.sentenceCount = 0;
				}
			}

			//SUBSTITUTE similiar words, based on LIWC categories
			else 
			{
				//ignore any punctuation
				if($.inArray('punct', msg.cats) < 0)
				{
					//try to find the 
					for (i in msg.cats)
					{
						//if it finds something with the same class
						var el = $('.' + msg.cats[i]).first();
						if (el.size() > 0) 
						{	
							//replace all the classes of the div with the new ones
							el.removeClass();
							el.addClass('landing-word');
							for (j in msg.cats) 
								{ el.addClass(msg.cats[j]); }			
							el.html(msg.word.toUpperCase());

							//make it invisible and then show it?
							el.css('opacity', '0.0');
							
							setTimeout(function(element){
								element.addClass('opacity-tween');
							}, 250, el);

							setTimeout(function(element){
								element.css('opacity', '1.0');
							}, 500, el);

							//set the top position, then slide it in?
							/*
							el.css('top', '100px');
							
							setTimeout(function(element){
								element.addClass('top-tween');
							}, 500, el);

							setTimeout(function(element){
								element.css('top', '200px');
							}, 1000, el);
							*/

						}
						//break so that the same word doesn't appear twice
						break;
					}
				}
				//terminate after a certain number of sentences
				//starting on sentences is clean
				else {
					if ((msg.word == '.') || (msg.word == '!') || (msg.word == '?')) this.sentenceCount++;
					if (this.sentenceCount > 4) {
						this.buildSentence = true;
						this.sentenceWordCount = 0;
						$('.sentence').empty();
					}
				}
			}

			//SET WORD POSITIONS
			this.setWordPositions($('.landing-word, .space-word'));

		 	
		}
	}
};