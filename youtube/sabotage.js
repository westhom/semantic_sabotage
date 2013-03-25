// URI parsing helper functions.
function parseUri (str) {
	var	o   = parseUri.options,
		m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i   = 14;

	while (i--) uri[o.key[i]] = m[i] || "";

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});

	return uri;
};


parseUri.options = {
	strictMode: false,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   {
		name:   "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};



function init() {
	
	var args = parseUri(document.URL).queryKey;
  //if (args.docName) {
  //	connect(args.docName, d);
  //}
}



// Connect via engine.io, send loadDoc message if docName is specified in URL args.
function connect() {
	console.log('connected');
	
}

// Handle incoming messages and distribute to appropriate functions.
function handleMessage(msg) {
	
	switch(msg.type) {
		case 'live':
			console.log('live');
			break;
		case 'word':
			handleWord(msg);
			break;
		case 'sentenceEnd':
			handleSentenceEnd(msg);
			break;
		case 'stats':
			handleStats(msg);
			break;
		default:
			break;
	}
}



function appendResults(text) {
  var results = document.getElementById('results');
  results.appendChild(document.createElement('P'));
  results.appendChild(document.createTextNode(text));
}


function load() {

	console.log("load");
	var config = JSON && JSON.parse(configJSON) || $.parseJSON(configJSON);
	//console.log(config);
	
	
	$.get('http://www.youtube.com/watch?v=rDiGYuQicpA', function(data) {
	  //$('#results').html(data);
	  //console.log(data);
	  var startInd = data.indexOf("ttsurl") + 10;
	  var endInd = data.indexOf('"', startInd);
	  var url = data.substring(startInd, endInd);
	  url = url.replace(/\\u0026/g, "&").replace(/\\\//g, "/") + "&type=track&lang=en&name&kind=asr&fmt=1";
	  
	  console.log(url);
	  
	  $.get(url, function(ccStr) {
			var captions=ccStr.getElementsByTagName("text");
			for (var i=0; i<captions.length; i++) {
				console.log(i+" "+captions[i].getAttribute("start")+" "+captions[i].getAttribute("dur")+" "+captions[i].childNodes[0].nodeValue);
			}
	  }, 'xml');
	  
	});
	
	
	//makeRequest();
  //gapi.client.setApiKey(config.youtube.api_key);
 // gapi.client.load('urlshortener', 'v1', makeRequest);
}














