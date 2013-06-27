var mad_lib = function(id) {

	return {
	
		name: "Mad Lib",
		author: "Sosolimited",
		
		defaultURL: "http://www.youtube.com/watch?v=u02nZW0QiSE",
		//$el: $('<div class="modeContainer" id="'+this.name+'"></div>'),
		$el: $('<div class="modeContainer" id="'+id+'"></div>'),
		lastLeadPunct: 0,
		lastEndPunct: 0,
		timeoutEvents: [],
		buildSentence: true,
		sentenceCount: 0,
		sentenceWordCount: 0,
		sentenceLengths: [5,7,6,6,7],
		sentenceLengthIndex: 0,
		 
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.$el.append('<div class="madlib container bg-white"></div>');

		},

		// Gets called evertime you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
			
			this.$el.find('.madlib').empty();
			this.buildSentence = true;

			var holder = $('<div class="sentence franklin-gothic-condensed"></div>');
			this.$el.find('.madlib').append(holder);
			
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

		clearTimeoutEvents: function(type) {
	    for (var i=0; i<this.timeoutEvents.length; i++) {
		    clearTimeout(this.timeoutEvents[i]);
	    };
    },

    //replace all the classes of the div with the new ones
    replaceWord: function(el, word, categories) {  
			el.removeClass();
			el.addClass('landing-word');
			
			for (j in categories) 
				{ el.addClass(categories[j]); }			
			el.html(word.toUpperCase());

			//make it invisible and then show it?
			el.css('opacity', '0.0');
			
			setTimeout(function(element){
				element.addClass('opacity-tween');
			}, 250, el);

			setTimeout(function(element){
				element.css('opacity', '1.0');
			}, 500, el);
		},

    setWordPositions: function(words) {
    	//words is a jQuery collection
    	//console.log('set word pos');
    	var x = 24;
    	var space_width = 24;
    	words.each(function(i) {
    		
    		$(this).css("left", x);
    		x += $(this).outerWidth();
    		x += space_width;
    		//console.log(i + ' ' + $(this).html() + ' '  + $(this).outerWidth());
    	});
    },

    exitWords: function(words) {
    	var y = this.$el.height();
    	//console.log('Exit Words to ' + y);
    	words.each(function(i) {
    		$(this).css('top', y+'px');
    	});
    },
		
		appendWordInContext: function(msg) {
			
			//check all words for no-categories
			if (msg.cats.length === 0)  {			
				//console.log('prelim : ' + msg.word);
			}

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
						if ((msg.cats[i] != 'funct') && 
							(msg.cats[i] != 'pronoun') && 
							(msg.cats[i] != 'verb') && 
							//(msg.cats[i] != 'adverb') && 
							//(msg.cats[i] != 'cogmech') && 
							//(msg.cats[i] != 'bio') && 
							//(msg.cats[i] != 'relativ') && 
							(msg.cats[i] != 'sentencesmode')) {
							el.addClass(msg.cats[i]);

							//console.log('word: ' + msg.word + ' Category ' + msg.cats[i]);
						}
					}

					//add an undefined class
					if (msg.cats.length === 0)  {
						el.addClass('no_category');
						//console.log('building :' + msg.word);
					}

					el.css('left', this.$el.find('.madlib').width());
					el.css('top', '200px');

					$('.sentence').append(el);

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
				if (this.sentenceWordCount >= this.sentenceLengths[this.sentenceLengthIndex])
				{
					//console.log(this.sentenceLengths[this.sentenceLengthIndex]);
					this.buildSentence = false;
					this.sentenceCount = 0;
					this.sentenceLengthIndex = (this.sentenceLengthIndex+1)%this.sentenceLengths.length;

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
							if (el.html() != msg.word)
							{
								//console.log('found: ' + el.html());				
								this.replaceWord(el, msg.word, msg.cats);
							}
						}
						//break so that the same word doesn't appear twice
						break;
					}
					//check for undefined category too
					if (msg.cats.length === 0)
					{
						var el = $('.no_category').first();
						//console.log("found1: %i %o ", el.size(), el );	
						if (el.size() > 0)
						{	
							//console.log('found2: ' + el.html());	
							if (el.html() != msg.word)
							{
								//console.log('found3: %o', el);				
								this.replaceWord(el, msg.word, msg.cats);
								found = true;
							}
						}

					}
				}
				//terminate after a certain number of sentences
				//starting on sentences is clean
				else {
					if ((msg.word == '.') || (msg.word == '!') || (msg.word == '?')) this.sentenceCount++;
					if (this.sentenceCount > 3) {
						this.buildSentence = true;
						this.sentenceWordCount = 0;
						
						this.$el.find('.landing-word').each(function(i) {
							$(this).removeClass();
							$(this).addClass('delete-word');
						});

						//move them
						setTimeout($.proxy(function(context){
						 	context.exitWords(this.$el.find('.delete-word'));
						}, this), 25, this);

						//delete those fuckers				
						setTimeout($.proxy(function(){
						 	this.$el.find('.delete-word').remove();
						}, this), 1000);

					}
				}
			}

			//SET WORD POSITIONS
			this.setWordPositions(this.$el.find('.landing-word, .space-word'));
		 	
		}
	}
};