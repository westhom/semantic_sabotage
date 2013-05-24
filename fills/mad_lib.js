var mode = function(id) {

	return {
	
		name: "Mad Lib",
		defaultURL: "http://www.youtube.com/watch?v=l26Uq3PX-fk",
		//el: $('<div class="modeContainer" id="'+this.name+'"></div>'),
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		lastLeadPunct: 0,
		lastEndPunct: 0,
		timeoutEvents: [],
		nounIndex: 0,
				 
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append('<div id="madlib" class="container bg-white"></div>');

		},

		// Gets called evertime you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
			$('#madlib').empty();
			
			var intro = 'A screaming comes across the sky.';
			var holder = $('<div class="sentence meta-serif-book size-64"></div>');

			holder.append('<div class="variable pronoun" >IT </div>');
			holder.append('<div class="variable past present future">WAS </div>');
			holder.append('<div class="variable article">THE </div>');
			holder.append('<div class="variable quant">BEST </div>');
			holder.append('<div class="variable prep">OF </div>');
			holder.append('<div class="variable time">TIMES </div>');

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
		
		appendWordInContext: function(msg) {

			var categories = ['pronoun', 'past', 'present', 'future', 'article', 'quant', 'prep', 'time'];
			var found = false;

			//ignore any punctuation
			if($.inArray('punct', msg.cats) < 0)
			{

				//no categories is a strange mix
				//if (msg.cats.length < 1) console.log(msg.word);	

				for (i in categories)
				{
					var term = categories[i];
					var word = msg.word.toUpperCase();			
					if ($.inArray(term, msg.cats) >= 0)
					{
						//console.log(term + ' >> ' + msg.word);
						$('.' + term).html(word + ' ');
						break;
					}
					
				}

			}

		 	
		}
	}
};