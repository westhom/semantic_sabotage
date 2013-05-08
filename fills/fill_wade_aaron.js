var mode = function() {

	return {
	
		name: "Wade Aaron",
		
		// Handle incoming word message.
		handleWord: function(msg) {
			//console.log('word '+msg.word);
						
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
			//if (!msg.sentenceStartFlag && !msg.punctuationFlag)
			//	$('#words').append(' ');
				
			//$('#words').append(msg.word);

			// update curSentence
			if (!msg.sentenceStartFlag && !msg.punctuationFlag)
				$('#words').append(' ');
				
			var s = document.createElement('span');
			s.innerHTML = msg.word;

			$(s).addClass('aaron');
			$('#words').append(s);

			if (msg.cats.length > 0) {
				$(s).addClass('test')
				if ($.inArray('funct', msg.cats) >= 0) $(s).addClass('funct');
				if ($.inArray('verb', msg.cats) >= 0) $(s).addClass('verb');
				$('#words').append(s);
			}
		}
	}
};