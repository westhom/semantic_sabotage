var mode = function(id) {

	return {
	
		name: "Blur Painting",
		defaultURL: "http://www.youtube.com/watch?v=l26Uq3PX-fk",
		el: $('<div class="modeContainer" id="'+id+'"></div>'),
		curWordPos: 0,

		// Anything you want to do to initialize your mode. 
		// This gets called once after the mode is created.
		init: function() {
			this.el.append('<div id="bp_container"></div>');
		},

		// Gets called evertime you go to the mode.
		enter: function() {
		},

		// Handle incoming word message.
		handleWord: function(msg) {
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

		 	var c;
		 	if($.inArray('affect', msg.cats) >= 0) c = 'red';
		 	else if($.inArray('cogmech', msg.cats) >= 0) c = 'green';
		 	else if($.inArray('senses', msg.cats) >= 0) c = 'blue';
		 	else if($.inArray('time', msg.cats) >= 0) c = 'pink';
		 	else c = 'rgb(40,40,40)';

			var s = $('<div class= "faller proxima-nova-400" style="color:' + c + '; opacity:1; top:0px">' + msg.word + '</div>');
		 	var ww = $('#bp_container').width();

			//$(s).addClass('faller proxima-nova-400');			
			//$(s).append(msg.word);
			$(s).css('left', this.curWordPos + 'px');		
			$('#bp_container').append(s);
			var h = 50*msg.word.length;
			setTimeout(function(e){
				e.css({'color':'transparent', 'text-shadow':'0 0 72px '+c,'top':h+'px'});
			}, 20, s);


			this.curWordPos = (this.curWordPos + 50)%ww;
			console.log("width =" + ww);

		 	var death = 30000;
		 	$(s).on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
		 	function() { 
		 		setTimeout(function(){$(s).remove()},death);
		 	});

		}
	}
};