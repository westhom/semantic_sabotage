var mode = function(id) {

	return {
	
		name: "One Word",

		defaultURL: "http://www.youtube.com/watch?v=l-gQLqv9f4o&t=0m12s",
		//usfRtJpyJDk = how to behave in court
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		template: true,
				 

		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append("<div class='topContainer'><div class='centerContainer'></div></div>");
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
			this.el.find('.centerContainer').empty();
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
		 	if (!msg.sentenceStartFlag && !msg.punctuationFlag)
		 		this.el.append(' ');
		 	
		 	var c;
		 	if($.inArray('funct', msg.cats) >= 0) c = 'rgb(255,0,0)';
		 	else if($.inArray('percept', msg.cats) >= 0) c = 'rgb(0,255,0)';
		 	else if($.inArray('heshe', msg.cats) >= 0) c = 'rgb(45,255,0)';
		 	else if($.inArray('verbs', msg.cats) >= 0) c = 'rgb(255,180,140)';
		 	else c = 'rgb(40,40,40)';

		 	var w = $('<div class= "museo-slab-1000-italic" style="font-size:'+200+'px; color:' + c + ';">' + msg.word + '</div>');
		 	this.el.find('.centerContainer').html(w);
		}
	}
};