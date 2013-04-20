var Parser = function(messages) {	

	var db = new localStorageDB("db", localStorage);;
	var messages = messages;

	var statsHandler = StatsHandler(messages, db);
	

	return {
	
		initialize: function(callback, args) {
			// making two tables for LIWC because it's faster
			
			// load non-wild table
		  if (!db.tableExists("LIWC_words")) 
		  	db.createTable("LIWC_words", ["word", "cats", "wildcard"]);
		  db.truncate("LIWC_words");
		  
		  $.getJSON("LIWC/LIWC.json", function(json) {
		  	for (var i=0; i<json.length; i++) {
		  		if (json[i]['word'])
				  	db.insertOrUpdate("LIWC_words", {word: json[i]['word']}, {word: json[i]['word'], wildcard: json[i]['wildcard'], cats: json[i]['cat']});
		  	}
		  	console.log("loaded nonwild "+json.length);
		  	
		  	// then load wild table
			  if (!db.tableExists("LIWC_words_wild")) 
			  	db.createTable("LIWC_words_wild", ["word", "cats", "wildcard"]);
			  db.truncate("LIWC_words_wild");
			  
			  $.getJSON("LIWC/LIWC_wildcards.json", function(json) {
			  	for (var i=0; i<json.length; i++) {
			  		if (json[i]['word'])
					  	db.insertOrUpdate("LIWC_words_wild", {word: json[i]['word']}, {word: json[i]['word'], wildcard: json[i]['wildcard'], cats: json[i]['cat']});
			  	}
			  	console.log("loaded wild "+json.length);
			  	db.commit();
			  	
			  	// call callback fxn
			  	callback(args);
			  });
		  	
		  });
		 
		}, 
	
		parseLine: function(line) {
		
		console.log(line);
			var spaceRegEx = new RegExp(/\S{1,}/g);
			var leadPunctRegEx = new RegExp(/^[\"|\'|>|<|\-|\+|\[|\{|$]{1,}/); //JRO edit
			var numberRegEx = new RegExp(/\d{1,}.{1,}\d{1,}/);
			var abbrevRegEx = new RegExp(/\w{1,}[\'|\-]\w{1,}/); //JRO edit
			//var wordRegEx = new RegExp(/\w{1,}/);
			var wordRegEx = new RegExp(/[\w|@|#]{1,}/);
			var urlRegEx = new RegExp(/(http:\/\/|www)\S{1,}/);
		
		
			// grab parts from xml
			var text = line[0];
			console.log(text);
			// TODO: are there more of these that need to be replaced? 
			text = text.replace("&#39;", "'");
			
			//console.log(line.text['@attributes']);
			var start = 1000*parseFloat(line['@attributes']['start']);
			var dur = 1000*parseFloat(line['@attributes']['dur']);
			console.log("start "+start+" dur "+dur);
			
			// add words to sentence
			//split input string with RegExo
			var tokens = text.match(spaceRegEx);
			var numWords = tokens.length;
			var wordDur = dur/numWords;
			
		
			for (i in tokens) //JRO - hack to only process one token at a time
			{
				//If the element isn't the last in an array, it is a new word
				if (tokens[i] !== "") 
				{
					var tok = tokens[i];
					//if (print) console.log(tok);
					
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
							//console.log('abbrev');
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
					var msgTime = start + Math.round(i*wordDur);
					
					// add message
					if (leadPunct) {
						msgTime -= 5;
						var msg = {type: "word", time:msgTime, word:endPunct, cats:["punct", "leadPunct"]};
						messages.push(msg);
						console.log(msg);
					}
					if (word) {
						word = word.toString();
						var cats = this.getCats(word.toString());
						statsHandler.logWordInstance(word, cats);
						var msg = {type: "word", time:msgTime, word:word, cats:this.getCats(word)};
						messages.push(msg);
						console.log(msg);
					}
					if (endPunct) {
						msgTime += 5;		
						var msg = {type: "word", time:msgTime, word:endPunct, cats:["punct", "endPunct"]};
						messages.push(msg);
						console.log(msg);
						// also send sentenceEnd msg? PEND: necessary or can we check for cat endPunct?
						messages.push({type: "sentenceEnd", time:msgTime});
					}
					
				}
			}
			
			// calculate stats for the line
			statsHandler.doStats(start+dur);
		},
		
		getCats: function(w) {
			var cats = [];
			
			// check for regular match
			var res = db.query("LIWC_words", {word: w.toLowerCase()}); 
			if (res.length > 0) {
				cats = res[0].cats;
			}
			
			// check for wildcards
			else {
			// select all books by Torday and Sparrow
				res = db.query("LIWC_words_wild", function(row) {
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
		}
	}
};



