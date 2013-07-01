var one_by_one = function(id) {

	return {
	
		name: "One x One",
		author: "Sosolimited",

		//defaultURL: "http://www.youtube.com/watch?v=gdtQrSnEPCM&t=0m3s", //pacino, broken
		defaultURL: "http://www.youtube.com/watch?v=6ucfgdFrlho&t=0m5s", //arnie
		//usfRtJpyJDk = how to behave in court
		$el: $('<div class="modeContainer" id="'+id+'"></div>'),
		fontSize: 200,
				 

		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.$el.append('<div class="topContainer"><div class="word centerContainer museo-slab-1000-italic">Hello</div></div>');
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
			this.$el.find('.word').empty();
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

			//if($.inArray('punct', msg.cats) < 0)
			//{

				//console.log(msg.word);

			 	var c;
			 	var uprword = msg.word.toUpperCase();
			 	
			 	if($.inArray('swear', msg.cats) >= 0) c = 'rgb(250,16,48)'; //bright red
			 	//else if($.inArray('negemo', msg.cats) >= 0) c = 'rgb(107,0,56)'; //purple
			 	else if((uprword.indexOf('LIVE') >= 0) || (uprword.indexOf('LIFE') >= 0) || ($.inArray('health', msg.cats) >= 0)) c = 'rgb(49,211,255)'; //cyan
			 	else if((uprword.indexOf('GAME') >= 0) || ($.inArray('leisure', msg.cats) >= 0)) c = 'rgb(0,229,120)'; //mint green
			 	else if($.inArray('time', msg.cats) >= 0) c = 'rgb(255,208,75)'; //mustard
			 	else if(uprword.indexOf('INCH') >= 0) c = 'rgb(255,240,195)'; //white
			 	
			 	//else if (msg.cats.length == 0) c = 
			 	else c = 'rgb(33,31,24)';


			 	this.$el.find('.word').html(msg.word);
 	
			 	this.$el.find('.word').css('font-size', this.fontSize + 'px');
			 	this.$el.find('.word').css('color', c);

			 	//scaling down if word is too big
			 	
			 	var size = this.fontSize;
			 	var ratio = 0.58; //estimating that the average character is this wide in relation to font size
			 	var curWordWidth = size * msg.word.length * ratio;

			 	while (curWordWidth > window.innerWidth) {
			 		size -= 20;
			 		curWordWidth = size * msg.word.length * ratio; 		
			 	}

			 	this.$el.find('.word').css('font-size', size + 'px');
				
		 	//}
		 	
		}
	}
};