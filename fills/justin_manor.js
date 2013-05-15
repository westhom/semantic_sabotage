var mode = function(id) {

	return {
	
		name: "Lyrics Test",

		defaultURL: "http://www.youtube.com/watch?v=cpQtyCCJk0c",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
				 

		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append("<div id='jm' class='container'></div>");
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			console.log(this.name+" enter()");
			$('#jm').empty();
		},


		// Handle incoming word message.
		handleWord: function(msg) {
			console.log('word '+msg.word);
			this.appendWordInContext(msg);
		},
		
		// Handle incoming sentenceEnd message.
		handleSentenceEnd: function(msg) {
			console.log('sentenceEnd');	
		},
		
		// Handle incoming stats message.
		handleStats: function(msg) {
			console.log(msg);
		},
		
		appendWordInContext: function(msg) {
		
		 	// update curSentence
		 	if (!msg.sentenceStartFlag && !msg.punctuationFlag)
		 		this.el.append(' ');
		 	
		 	var c;
		 	var anim;

		 	if($.inArray('funct', msg.cats) >= 0)  {
		 		c = 'rgb(255,0,0)';
		 		anim = 'funct';
		 	} else if($.inArray('percept', msg.cats) >= 0) {
		 		c = 'rgb(0,255,0)';
		 		anim = '';
		 	} else if($.inArray('heshe', msg.cats) >= 0) {
		 		c = 'rgb(45,255,0)';
		 		anim = '';
		 	} else if($.inArray('verbs', msg.cats) >= 0) {
		 		c = 'rgb(255,180,140)';
		 		anim = 'verb';
		 	} else {
		 		c = 'rgb(40,40,40)';
		 		anim = '';
			}
			var injected = '<span class= "museo-slab-1000 size-512 ' + anim + '" >' + msg.word + '</span>';
			console.log(injected);	
		 	$('#jm').html(injected);
		}
	}
};