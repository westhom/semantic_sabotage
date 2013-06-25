var rainbow_sort = function(id) {

	return {
	
		name: "Rainbow Sort",
		author: "Sosolimited",

		defaultURL: "http://www.youtube.com/watch?v=OQSNhk5ICTI", //Double Rainbow!
		el: $('<div class="modeContainer" style="background-color:black" id="'+id+'"></div>'),
				 
		//line spacing between words in the stack		 
		lineHeight: 72,
		// There's a hack here to make some 5-letter words to fill out the rainbow
		whoaToggle: true, 

		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append("<div id='one' class='container'></div><div id='two' class='container2'></div><div id='three' class='container3'></div><div id='four' class='container4'></div><div id='five' class='container5'></div><div id='six' class='container6'></div><div id='seven' class='container7'></div><div id='eight' class='container8'></div><div id='nine' class='container9'></div><div id='ten' class='container10'></div>");
		},

		// Gets called evertime you go to the mode.
		enter: function() {
			//empty out all the words columns
			$('#one').empty();
			$('#two').empty();
			$('#three').empty();
			$('#four').empty();
			$('#five').empty();
			$('#six').empty();
			$('#seven').empty();
			$('#eight').empty();
			$('#nine').empty();
			$('#ten').empty();
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
				 	$('#one').prepend(e);
				 	//walk through all old words in that column and push them down and fade them down a little
			 		$('#one').children().each(function(i){
				 		var t = h*i+"px";
				 		var o = 1.0 - i*0.07;
				 		$(this).css("top", t);
				 		$(this).css("opacity", o);
			 		});
			 		//grow height of div by lineHeight
			 		$('#one').css('height', $('#one > .bigText').length*this.lineHeight+"px");					 	
				} else if (msg.word.length === 2) { //two letter words
				 	$('#two').prepend(e);
			 		$('#two').children().each(function(i){
				 		var t = h*i+"px";
				 		var o = 1.0 - i*0.07;
				 		$(this).css("top", t);
				 		$(this).css("opacity", o);
			 		});
			 		$('#two').css('height', $('#two > .bigText').length*this.lineHeight+"px");		
				} else if (msg.word.length === 3) { //....
				 	$('#three').prepend(e);
			 		$('#three').children().each(function(i){
				 		var t = h*i+"px";
				 		var o = 1.0 - i*0.07;
				 		$(this).css("top", t);
				 		$(this).css("opacity", o);
			 		});
			 		$('#three').css('height', $('#three > .bigText').length*this.lineHeight+"px");			 	
				} else if (msg.word.length === 4) {
				 	$('#four').prepend(e);
			 		$('#four').children().each(function(i){
				 		var t = h*i+"px";
				 		var o = 1.0 - i*0.07;
				 		$(this).css("top", t);
				 		$(this).css("opacity", o);
			 		});
			 		$('#four').css('height', $('#four > .bigText').length*this.lineHeight+"px");
				} else if (msg.word.length === 5) {
				 	$('#five').prepend(e);
			 		$('#five').children().each(function(i){
				 		var t = h*i+"px";
				 		var o = 1.0 - i*0.07;
				 		$(this).css("top", t);
				 		$(this).css("opacity", o);
			 		});
			 		$('#five').css('height', $('#five > .bigText').length*this.lineHeight+"px");			
				} else if (msg.word.length === 6) {			 			 				 
				 	$('#six').prepend(e);
			 		$('#six').children().each(function(i){
				 		var t = h*i+"px";
				 		var o = 1.0 - i*0.07;
				 		$(this).css("top", t);
				 		$(this).css("opacity", o);
			 		});
			 		$('#six').css('height', $('#six > .bigText').length*this.lineHeight+"px");		
				 } else if (msg.word.length === 7){				 			 				 
				 	$('#seven').prepend(e);
			 		$('#seven').children().each(function(i){
				 		var t = h*i+"px";
				 		var o = 1.0 - i*0.07;
				 		$(this).css("top", t);
				 		$(this).css("opacity", o);
			 		});
			 		$('#seven').css('height', $('#seven > .bigText').length*this.lineHeight+"px");		
				 } else if (msg.word.length === 8){
				 	$('#eight').prepend(e);
			 		$('#eight').children().each(function(i){
				 		var t = h*i+"px";
				 		var o = 1.0 - i*0.07;
				 		$(this).css("top", t);
				 		$(this).css("opacity", o);
			 		});
			 		$('#eight').css('height', $('#eight > .bigText').length*this.lineHeight+"px");		
				 } else if (msg.word.length === 9){ 				 
				 	$('#nine').prepend(e);
			 		$('#nine').children().each(function(i){
				 		var t = h*i+"px";
				 		var o = 1.0 - i*0.07;
				 		$(this).css("top", t);
				 		$(this).css("opacity", o);
			 		});
			 		$('#nine').css('height', $('#nine > .bigText').length*this.lineHeight+"px");		
				 } else {			 
				 	$('#ten').prepend(e);
			 		$('#ten').children().each(function(i){
				 		var t = h*i+"px";
				 		var o = 1.0 - i*0.07;
				 		$(this).css("top", t);
				 		$(this).css("opacity", o);
			 		});
			 		$('#ten').css('height', $('#ten > .bigText').length*this.lineHeight+"px");		
				 }
			}
		}
	}
};