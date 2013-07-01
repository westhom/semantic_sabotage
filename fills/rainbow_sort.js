var rainbow_sort = function(id) {

	return {
	
		name: "Rainbow Sort",
		author: "Sosolimited",

		defaultURL: "http://www.youtube.com/watch?v=OQSNhk5ICTI", //Double Rainbow!
		$el: $('<div class="modeContainer" style="background-color:black" id="'+id+'"></div>'),
				 
		//line spacing between words in the stack		 
		lineHeight: 72,
		// There's a hack here to make some 5-letter words to fill out the rainbow
		whoaToggle: true, 

		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.$el.append("<div class='one container'></div><div class='two container2'></div><div class='three container3'></div><div class='four container4'></div><div class='five container5'></div><div class='six container6'></div><div class='seven container7'></div><div class='eight container8'></div><div class='nine container9'></div><div class='ten container10'></div>");
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			//empty out all the words columns
			this.$el.find('.one').empty();
			this.$el.find('.two').empty();
			this.$el.find('.three').empty();
			this.$el.find('.four').empty();
			this.$el.find('.five').empty();
			this.$el.find('.six').empty();
			this.$el.find('.seven').empty();
			this.$el.find('.eight').empty();
			this.$el.find('.nine').empty();
			this.$el.find('.ten').empty();
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
		 	if($.inArray('punct', msg.cats) < 0){
			 	
		 		//a little hack to fill out the 5-letter word column. converts every other 'whoa' to a 'whoah'
				if (msg.word.toUpperCase() === 'WHOA') {
					if (this.whoaToggle)
						msg.word = 'WHOAH';	
					//console.log("whoa = " + msg.word);
					this.whoaToggle = !this.whoaToggle;
				} 

				var e = $('<div class= "bigText motor" opacity:0;">' + msg.word.toUpperCase() + '</div>');

				//wait until element is in the DOM (20ms) until you start animating it
			 	setTimeout(function(element){
			 		element.css("opacity", "1");	
			 	},20,e);

				var h = this.lineHeight;

				//sort words by # of characters and place them in the correct div
			 	if (msg.word.length === 1) { //one letter words
				 	this.$el.find('.one').prepend(e);
				 	//walk through all old words in that column and push them down and fade them down a little
			 		this.$el.find('.one').children().each(function(i){
				 		var t = h*i+"px";
				 		var o = 1.0 - i*0.07;
				 		$(this).css("top", t);
				 		$(this).css("opacity", o);
			 		});
			 		//grow height of div by lineHeight
			 		this.$el.find('.one').css('height', this.$el.find('.one > .bigText').length*this.lineHeight+"px");					 	
				} else if (msg.word.length === 2) { //two letter words
				 	this.$el.find('.two').prepend(e);
			 		this.$el.find('.two').children().each(function(i){
				 		var t = h*i+"px";
				 		var o = 1.0 - i*0.07;
				 		$(this).css("top", t);
				 		$(this).css("opacity", o);
			 		});
			 		this.$el.find('.two').css('height', this.$el.find('.two > .bigText').length*this.lineHeight+"px");		
				} else if (msg.word.length === 3) { //....
				 	this.$el.find('.three').prepend(e);
			 		this.$el.find('.three').children().each(function(i){
				 		var t = h*i+"px";
				 		var o = 1.0 - i*0.07;
				 		$(this).css("top", t);
				 		$(this).css("opacity", o);
			 		});
			 		this.$el.find('.three').css('height', this.$el.find('.three > .bigText').length*this.lineHeight+"px");			 	
				} else if (msg.word.length === 4) {
				 	this.$el.find('.four').prepend(e);
			 		this.$el.find('.four').children().each(function(i){
				 		var t = h*i+"px";
				 		var o = 1.0 - i*0.07;
				 		$(this).css("top", t);
				 		$(this).css("opacity", o);
			 		});
			 		this.$el.find('.four').css('height', this.$el.find('.four > .bigText').length*this.lineHeight+"px");
				} else if (msg.word.length === 5) {
				 	this.$el.find('.five').prepend(e);
			 		this.$el.find('.five').children().each(function(i){
				 		var t = h*i+"px";
				 		var o = 1.0 - i*0.07;
				 		$(this).css("top", t);
				 		$(this).css("opacity", o);
			 		});
			 		this.$el.find('.five').css('height', this.$el.find('.five > .bigText').length*this.lineHeight+"px");			
				} else if (msg.word.length === 6) {			 			 				 
				 	this.$el.find('.six').prepend(e);
			 		this.$el.find('.six').children().each(function(i){
				 		var t = h*i+"px";
				 		var o = 1.0 - i*0.07;
				 		$(this).css("top", t);
				 		$(this).css("opacity", o);
			 		});
			 		this.$el.find('.six').css('height', this.$el.find('.six > .bigText').length*this.lineHeight+"px");		
				 } else if (msg.word.length === 7){				 			 				 
				 	this.$el.find('.seven').prepend(e);
			 		this.$el.find('.seven').children().each(function(i){
				 		var t = h*i+"px";
				 		var o = 1.0 - i*0.07;
				 		$(this).css("top", t);
				 		$(this).css("opacity", o);
			 		});
			 		this.$el.find('.seven').css('height', this.$el.find('.seven > .bigText').length*this.lineHeight+"px");		
				 } else if (msg.word.length === 8){
				 	this.$el.find('.eight').prepend(e);
			 		this.$el.find('.eight').children().each(function(i){
				 		var t = h*i+"px";
				 		var o = 1.0 - i*0.07;
				 		$(this).css("top", t);
				 		$(this).css("opacity", o);
			 		});
			 		this.$el.find('.eight').css('height', this.$el.find('.eight > .bigText').length*this.lineHeight+"px");		
				 } else if (msg.word.length === 9){ 				 
				 	this.$el.find('.nine').prepend(e);
			 		this.$el.find('.nine').children().each(function(i){
				 		var t = h*i+"px";
				 		var o = 1.0 - i*0.07;
				 		$(this).css("top", t);
				 		$(this).css("opacity", o);
			 		});
			 		this.$el.find('.nine').css('height', this.$el.find('.nine > .bigText').length*this.lineHeight+"px");		
				 } else {			 
				 	this.$el.find('.ten').prepend(e);
			 		this.$el.find('.ten').children().each(function(i){
				 		var t = h*i+"px";
				 		var o = 1.0 - i*0.07;
				 		$(this).css("top", t);
				 		$(this).css("opacity", o);
			 		});
			 		this.$el.find('.ten').css('height', this.$el.find('.ten > .bigText').length*this.lineHeight+"px");		
				 }
			}
		}
	}
};