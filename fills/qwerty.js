var qwerty = function(id) {
  fontClass = "franklin-gothic-condensed";//museo-slab-100
  function position($letter, pos, origin) {
    $letter.css({
      left: pos.left - origin.left,
      top: pos.top - origin.top,
      "font-size": pos["font-size"],
    });
  }
  function flyTo($letter, pos, origin, delay) {
    delay = delay || 0
    setTimeout(function() {
      position($letter, pos, origin);
    }, 300 + delay);
  }
  return {
		name: "Qwerty",
		author: "Amit",
		//defaultURL: "http://www.youtube.com/watch?v=YLO7tCdBVrA", //Bob Ross, Amit's 1st choice
		defaultURL: "http://www.youtube.com/watch?v=o1qsr76E5ww&t=0m1s", //something else that works
		$el: $('<div class="modeContainer ' + fontClass + '" id="'+id+'"></div>'),		

		init: function() {
			this.$main = $("<div id='qwerty' class='container'></div>").appendTo(this.$el);
			this.letterStr = ["qwertyuiop", "asdfghjkl", "zxcvbnm,."];
			keyspans = this.letterStr.map(function(str) {
			  return '<div>' + 
  			  (str).toUpperCase().replace(/(.)/g, "<span><span data-letter='$1'>$1</span></span>") +
  			  '</div>';
		  }).join('');
		  this.letterStr = this.letterStr.join('')
			this.$keys = $("<div id='keys'>" + keyspans + "</div>").appendTo(this.$main);
			this.$ref = $("<div id='ref'></div>").appendTo(this.$main);
			this.$letters = $("<div class='letters_container'></div>").appendTo(this.$main);
		},
		
		enter: function() {
			this.origin = this.$main.offset()
			console.log(this.origin)
		},
		
		handleWord: function(msg) {
      // console.log('word '+msg.word,msg);
			this.appendWordInContext(msg);
		},
		
		// HANDLE INCOMING sentenceEnd MESSAGE.
		// Called each time a new sentence is complete.
		handleSentenceEnd: function(msg) {
			//console.log('sentenceEnd');	
		},
		
		// HANDLE INCOMING stats MESSAGE.
		// Called with each sentence.
		// Passes a collection of interesting language statistics.
		handleStats: function(msg) {
      // console.log('stats', msg);
      this.$ref.empty();
      
      var $out = this.$letters;
      $out.css({
        top: 600,
        opacity: 0
      });
      setTimeout(function() {
        $out.remove()
      }, 4000)
      this.$letters = $("<div class='letters_container'></div>").appendTo(this.$main);
		},
		
		// APPEND WORD TO DOM.
		// This is where you insert your words into the DOM.
		appendWordInContext: function(msg) {
		  if($.inArray('punct', msg.cats) == -1) 
  		  this.$ref.append('<span> </span>');
  		  
		  word = msg.word;
		  var _this = this;
		  $wordRef = $('<span class="word_ref"></span>').appendTo(this.$ref);
		  
		  letters = word.split('').forEach(function(letter, i) {
		    if(_this.letterStr.indexOf(letter.toLowerCase()) == -1) return;
  		  $letterSrc = _this.$keys.find("span[data-letter='" + letter.toUpperCase() + "']");
  		  if (!$letterSrc || $letterSrc.length == 0) return;
        start = $letterSrc.offset();
        start["font-size"] = "1em";//"2em";
        $letterRef = $('<span>' + letter.toUpperCase() + '</span>').appendTo($wordRef);
        end = $letterRef.offset();
        end["font-size"] = "1em";
        $letter = $('<div class="letter">' + letter.toUpperCase() + '</span>').appendTo(_this.$letters);
        if($.inArray('negemo', msg.cats) > -1 || $.inArray('you', msg.cats) > -1) 
          $letter.css('color', '#c00');
        else if($.inArray('posemo', msg.cats) > -1) 
          $letter.css('color', '#0f6');
        else if($.inArray('verb', msg.cats) > -1) 
          $letter.css('color', '#0cf');
        position($letter, start, _this.origin);
        flyTo($letter, end, _this.origin, i * 50);
		  });
	  }


  };
};