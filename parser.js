var Parser = function(db, messages) {	

	// var db = db;
	// var messages = messages;

	// var statsHandler = StatsHandler(messages, db);
	

	return {

		db: null,
		messages: null,
		statsHandler: null,

		setup: function(db, messages) {
			this.db = db;
			this.messages = messages;
			this.statsHandler = StatsHandler(this.messages, this.db);
		},
	
		initialize: function(callback, args) {
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
		  	console.log("Created LIWC_words table");
		  	//this.db.truncate("LIWC_words");
		  		var thisthis = this;
			  $.getJSON("LIWC/LIWC.json", function(json) {
			  	for (var i=0; i<json.length; i++) {
			  		if (json[i]['word'])
					  	thisthis.db.insertOrUpdate("LIWC_words", {word: json[i]['word']}, {word: json[i]['word'], wildcard: json[i]['wildcard'], cats: json[i]['cat']});
			  	}
			  	console.log("loaded nonwild "+json.length);
			  	thisthis.db.commit();

			  	// then load wild table
				  if (!thisthis.db.tableExists("LIWC_words_wild")) {
				  	thisthis.db.createTable("LIWC_words_wild", ["word", "cats", "wildcard"]);
				  	thisthis.db.commit();
				  	//thisthis.db.truncate("LIWC_words_wild");
					  
					  $.getJSON("LIWC/LIWC_wildcards.json", function(json) {
					  	for (var i=0; i<json.length; i++) {
					  		if (json[i]['word'])
							  	thisthis.db.insertOrUpdate("LIWC_words_wild", {word: json[i]['word']}, {word: json[i]['word'], wildcard: json[i]['wildcard'], cats: json[i]['cat']});
					  	}
					  	console.log("loaded wild "+json.length);
					  	thisthis.db.commit();
					  	
					  	// call callback fxn
					  	callback(args);
					  });
					} else callback(args);
		
			  });
		 } else callback(args);
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



