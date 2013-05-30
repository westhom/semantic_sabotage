var mode = function(id) {

	return {
	
		name: "Basic Taxonomy",
		defaultURL: "http://www.youtube.com/watch?v=w5R8gduPZw4",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		index: 0,
		
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {

		},

		// Gets called evertime you go to the mode.
		enter: function() {

			this.el.empty();

			this.el.append('<div class="container proxima-nova-700"><div>');

			var so = document.createElement('div');
			$(so).addClass('so' + this.index);
			$(so).addClass('sentenceObject');
			this.el.find('.container').append(so);

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

		 	if ($.inArray('endPunct', msg.cats) >= 0) {

				this.el.find('.so' + this.index).css('opacity','0');
//				this.el.find('.so' + this.index).css('text-shadow','0px 0px 100px');

				setTimeout( function() { this.el.find('.so' + this.index).remove() }, 2000 );

				this.index++;

				var so = document.createElement('div');
				$(so).addClass('so' + this.index);
				$(so).addClass('sentenceObject');
				this.el.find('.container').append(so);

			}

			else if ($.inArray('punct', msg.cats) < 0) {

				var cc = document.createElement('div');
				$(cc).addClass('categoryContainer');

				if (msg.cats.length <= 0) {
					$(cc).append('undefined');
				}
				else {
					for (var i=0; i<msg.cats.length; i++) {
						if (msg.cats[i] != 'sentencesmode') $(cc).append(msg.cats[i] + ' ');
					}
				}
				
				var wc = document.createElement('div');
				$(wc).addClass('wordContainer');
				$(wc).append(msg.word);
				$(wc).append(cc);

				this.el.find('.so' + this.index).append(wc);

				var wd = document.createElement('div');
				$(wd).addClass('wordContainer');
				$(wd).css('visibility','hidden');
				$(wd).append('. ');

				this.el.find('.so' + this.index).append(wd);

				this.el.find('.so' + this.index).css('top', this.el.find('.container').height()-this.el.find('.so' + this.index).height() +'px');

		 		setTimeout( function() { $(cc).css('opacity','1') }, 250 );

			}

		}
	}
};