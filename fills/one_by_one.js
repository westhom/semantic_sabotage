var mode = function(id) {

	return {
	
		name: "One x One",

		defaultURL: "http://www.youtube.com/watch?v=gdtQrSnEPCM",
		//usfRtJpyJDk = how to behave in court
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		fontSize: 200,
				 

		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append('<div class="topContainer"><div id="word" class="centerContainer museo-slab-1000-italic">Hello</div></div>');
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

			this.fontSize = 200 + msg["posemo"]*3000 - msg["negemo"]*2000;
			if (this.fontSize < 24) this.fontSize = 24;
		},
		
		appendWordInContext: function(msg) {

			if($.inArray('punct', msg.cats) < 0)
			{

				console.log(msg.word);

			 	var c;
			 	
			 	if($.inArray('home', msg.cats) >= 0) c = 'rgb(107,0,56)';
			 	else if($.inArray('bio', msg.cats) >= 0) c = 'rgb(250,16,48)';
			 	else if($.inArray('word', msg.cats) >= 0) c = 'rgb(219,198,0)';
			 	else if($.inArray('leisure', msg.cats) >= 0) c = 'rgb(0,168,88)';
			 	else if($.inArray('money', msg.cats) >= 0) c = 'rgb(250,95,62)';
			 	else if($.inArray('social', msg.cats) >= 0) c = 'rgb(0,65,55)';
			 	else if (msg.cats.length == 0) c = 'rgb(255,240,186)';
			 	else c = 'rgb(33,31,24)';
			 	$('#word').html(msg.word);
 	
			 	$('#word').css('font-size', this.fontSize + 'px');
			 	$('#word').css('color', c);

			 	//scaling down if word is too big
			 	
			 	var size = this.fontSize;
			 	var ratio = 0.58; //estimating that the average character is this wide in relation to font size
			 	var curWordWidth = size * msg.word.length * ratio;

			 	while (curWordWidth > window.innerWidth) {
			 		size -= 20;
			 		curWordWidth = size * msg.word.length * ratio; 		
			 	}

			 	$('#word').css('font-size', size + 'px');
				
		 	}
		 	
		}
	}
};