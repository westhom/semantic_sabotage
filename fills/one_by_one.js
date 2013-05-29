var mode = function(id) {

	return {
	
		name: "One x One",

		defaultURL: "http://www.youtube.com/watch?v=6ucfgdFrlho&t=0m05s",
		//usfRtJpyJDk = how to behave in court
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		fontSize: 200,
				 

		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append('<div class="topContainer"><div id="word" class="centerContainer museo-slab-1000-italic"></div></div>');
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
			$('#word').empty();
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
			//console.log('pos '+ msg["posemo"]   + ' neg ' + msg["negemo"]);

			this.fontSize = 200 + msg["posemo"]*1000 - msg["negemo"]*1000;
			if (this.fontSize < 24) this.fontSize = 24;
		},
		
		appendWordInContext: function(msg) {

		 	var c;
		 	if($.inArray('percep', msg.cats) >= 0) c = 'rgb(255,0,0)';
		 	else if($.inArray('bio', msg.cats) >= 0) c = 'rgb(0,255,0)';
		 	else if($.inArray('word', msg.cats) >= 0) c = 'rgb(45,255,0)';
		 	else if($.inArray('leisure', msg.cats) >= 0) c = 'rgb(255,180,140)';
		 	else if($.inArray('home', msg.cats) >= 0) c = 'rgb(255,180,140)';
		 	else if($.inArray('money', msg.cats) >= 0) c = 'rgb(0,180,140)';
		 	else if (msg.cats.length == 0) c = 'rgb(0,0,0)';
		 	else c = 'rgb(40,40,40)';

		 	$('#word').html(msg.word);
		 	$('#word').css('font-size', this.fontSize + 'px');
		 	$('#word').css('color', c);


		 	
		 	
		}
	}
};