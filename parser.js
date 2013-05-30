var Parser = function(db, messages) {	

	return {

		db: null,
		messages: null,
		statsHandler: null,

		initialize: function(db, messages) {
			this.db = db;
			this.messages = messages;
			
			// making two tables for LIWC because it's faster

			// create cached_messages table if nec
			//this.db.dropTable("cached_messages");
			if (!this.db.tableExists("cached_messages")) {
		  	this.db.createTable("cached_messages", ["ytID", "messages"]);
				this.db.commit();
			}

			// Use these two to trigger a re-build of the LIWC database
			//this.db.dropTable("LIWC_words");
			//this.db.dropTable("LIWC_words_wild");

			// load non-wild table if needed

		  if (!this.db.tableExists("LIWC_words")) {
		  	this.db.createTable("LIWC_words", ["word", "cats", "wildcard"]);
		  	//db.truncate("LIWC_words");
		  	for (var i=0; i<LIWC.length; i++) {
		  		if (LIWC[i]['word'])
				  	this.db.insertOrUpdate("LIWC_words", {word: LIWC[i]['word']}, {word: LIWC[i]['word'], wildcard: false, cats: LIWC[i]['cat']});
		  	}
		  	console.log("loaded nonwild "+LIWC.length);
		  	this.db.commit();
	 		}
	  	// then load wild table
		  if (!this.db.tableExists("LIWC_words_wild")) {
		  	this.db.createTable("LIWC_words_wild", ["word", "cats", "wildcard"]);
		  	//db.truncate("LIWC_words_wild");
			  
			  for (var i=0; i<LIWC_wild.length; i++) {
		  		if (LIWC_wild[i]['word'])
				  	this.db.insertOrUpdate("LIWC_words_wild", {word: LIWC_wild[i]['word']}, {word: LIWC_wild[i]['word'], wildcard: true, cats: LIWC_wild[i]['cat']});
		  	}
		  	console.log("loaded wild "+LIWC_wild.length);
		  	this.db.commit();	
			} 

			// init stats handler
			this.statsHandler = StatsHandler(this.messages, this.db);


		},
	
		parseLine: function(line) {

			//console.log(line);
			var spaceRegEx = new RegExp(/\S{1,}/g);
			var leadPunctRegEx = new RegExp(/^[\"|\'|\u201C|\u2018|>|<|\-|\+|\[|\{|$]{1,}/); //JRO edit
			//var leadPunctRegEx = new RegExp(/^\W{1,}/);
			var numberRegEx = new RegExp(/\d{1,}.{1,}\d{1,}/);
			var abbrevRegEx = new RegExp(/\w{1,}[\'|\-|\u2019]\w{1,}/); //JRO edit
			//var wordRegEx = new RegExp(/\w{1,}/);
			var wordRegEx = new RegExp(/[\w|@|#]{1,}/);
			var urlRegEx = new RegExp(/(http:\/\/|www)\S{1,}/);
		
		
			// grab parts from xml
			var text = line[0];
			//console.log(text);
			
			// TODO: are there more of these that need to be replaced? 
			// MANOR: quicky crash fix here to quit the fn if there's a blank line
			// JRO: cleaning up the text, replacing HTML entities 
			if (text)
			{
				//text = text.replace("&#39;", "'");
				//text = this.html_entity_decode(text);
				text = $('<textarea />').html(text).val();
				//console.log(text);
			}
			else
				return;

			//console.log(line.text['@attributes']);
			var start = 1000*parseFloat(line['@attributes']['start']);
			var dur = 1000*parseFloat(line['@attributes']['dur']);
			//console.log("start "+start+" dur "+dur);
			
			// add words to sentence
			//split input string with RegExo
			var tokens = text.match(spaceRegEx);
			var numWords = tokens.length;
			var wordDur = dur/numWords;
			
			// Figure out the average duration of a character. 
			// Then use this to give a custom duration to each word based on its char length.
			//JRO: if text starts to get jumbled, it has to do with the timing, add more to length to allow for wiggle room
			var charDur = dur/(text.length+3);
			var curTime = start;
			
			//var totalDur = curTime + charDur*text.length;
			//console.log(text + " length: " + text.length + " curTime: " + curTime + " charDur: " + charDur + " next: " + totalDur);
		
			for (i in tokens) //JRO - hack to only process one token at a time
			{
				//If the element isn't the last in an array, it is a new word
				if (tokens[i] !== "") 
				{
					var tok = tokens[i];

					//console.log(tok);
					
					var word = null;
					var leadPunct = null;
					var endPunct = null;
		
					//first look for a URL
					var urlText = tok.match(urlRegEx);
					if (urlText) {
						//if (print) console.log(urlText[0].toString());
						//word = urlText[0].toString();
						//if (print) console.log("Found URL, not adding: " + urlText[0].toString());
					}
					//otherwise treat the text normally
					else
					{
						// strip any leading punctuation
						leadPunct = tok.match(leadPunctRegEx);
						if (leadPunct) {
							//NOTE: substring was not working correctly ... might actually be length that was off
							//using replace instead
							tok = tok.replace(leadPunct, "");
							//if (print) console.log('lead p ' + leadPunct);
						}
						//if (print) console.log("tok1:"+tok);
			
						// pull any numbers	
						var numWord = tok.match(numberRegEx);
						if (numWord) {
							//console.log('number');
							word = numWord[0];
						}
						//console.log("tok2:"+tok);
			
						// pull any abbreviations
						var abbrevWord = tok.match(abbrevRegEx);
						if (abbrevWord && !word) {
							//console.log('abbrev ' + abbrevWord);
							word = abbrevWord[0];
						}
						//console.log("tok3:"+tok);
			
						// pull out word
						var plainWord = tok.match(wordRegEx);
						if (plainWord && !word) {
							word = plainWord[0];
						} 
						//console.log("tok4:"+tok);
						
						//look for final punctutation, the leftovers
						endPunct = tok.replace(word, "");
						
					}
					
					// timing
					//var msgTime = start + Math.round(i*wordDur);
					// Now word timing is based on char length of words. 
					
					//console.log(leadPunct + "___" + word + "___" +endPunct);

					// add message
					if (leadPunct) {
						//msgTime -= 5;
						var msg = {type: "word", time:curTime, word:leadPunct, cats:["punct", "leadPunct"]};
						//console.log(msg);
						this.messages.push(msg);												
						curTime += (charDur*(leadPunct.length));
					}
					if (word) {
						word = word.toString();
						var cats = this.getCats(word.toString());
						this.statsHandler.logWordInstance(word, cats);
						var msg = {type: "word", time:curTime, word:word, cats:this.getCats(word)};
						//console.log(msg);
						this.messages.push(msg);
						curTime += (charDur*(word.length+1));
					}
					if (endPunct) {
						//msgTime += 5;		
						var msg = {type: "word", time:curTime, word:endPunct, cats:["punct", "endPunct"]};
						//console.log(msg);
						this.messages.push(msg);
						// also send sentenceEnd msg? PEND: necessary or can we check for cat endPunct?
						this.messages.push({type: "sentenceEnd", time:curTime});
						curTime += (charDur*(endPunct.length));
					}
					

				}
			}
			
			// calculate stats for the line
			this.statsHandler.doStats(start+dur);
		},
		
		getCats: function(w) {
			var cats = [];
			
			// check for regular match
			var res = this.db.query("LIWC_words", {word: w.toLowerCase()}); 
			if (res.length > 0) {
				cats = res[0].cats;
			}
			
			// check for wildcards
			else {
			// select all books by Torday and Sparrow
				res = this.db.query("LIWC_words_wild", function(row) {
			    if(w.toLowerCase().indexOf(row.word) == 0) {
			        return true;
			    } else {
			        return false;
			    }
			  });
			  if (res.length > 0) {
				  cats = res[0].cats;
			  }
			}
						 
			return cats;
		},

		cacheMessages: function(ytID) {
			this.db.insertOrUpdate("cached_messages", {ytID: ytID}, {ytID: ytID, messages: this.messages});
			this.db.commit();
			console.log("cached messages for "+ytID);
		}
	}
};



