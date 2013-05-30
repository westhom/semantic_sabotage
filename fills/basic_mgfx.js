var mode = function(id) {

	return {
	
		name: "Basic Motion",
		defaultURL: "http://www.youtube.com/watch?v=l26Uq3PX-fk",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		index: 0,
		
		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {

		},

		// Gets called evertime you go to the mode.
		enter: function() {

			this.el.append('<div class="container proxima-nova-700"><div>');

			var so = document.createElement('div');
			$(so).attr('id','so' + this.index);
			$(so).addClass('sentenceObject');
			$(so).append('<div class="wordContainer">START</div>');
			$(so).css('top', ($('#basic_mgfx .container').height() - $('#so'+this.index).height())/2 + 'px');
			$('#basic_mgfx .container').append(so);
			$(so).empty(' ');

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

				$('#so'+this.index).css('opacity','0');

				this.index++;

				var so = document.createElement('div');
				$(so).attr('id','so' + this.index);
				$(so).addClass('sentenceObject');
				$(so).append('<div class="wordContainer">START</div>');
				$(so).css('top', ($('#basic_mgfx .container').height() - $('#so'+this.index).height())/2 + 'px');
				$('#basic_mgfx .container').append(so);
				$(so).empty(' ');

			}

			else if ($.inArray('punct', msg.cats) < 0) {

				var wo = document.createElement('div');
				$(wo).addClass('wordObject');
				$(wo).append(msg.word);

				var wc = document.createElement('div');
				$(wc).addClass('wordContainer');
				$(wc).append(msg.word + ' ');
				$(wc).append(wo);

				$('#so'+this.index).append(wc);
	
			}

			$('#so'+this.index).css('top', ($('#basic_mgfx .container').height() - $('#so'+this.index).height())/2 + 'px');

		}
	}
};