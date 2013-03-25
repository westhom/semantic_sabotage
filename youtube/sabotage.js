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

function auth(client_id) {
  var config = {
		'client_id': client_id,
    'scope': 'https://www.googleapis.com/auth/urlshortener'
  };
  gapi.auth.authorize(config, function() {
    console.log('login complete');
    console.log(gapi.auth.getToken());
  });
}


function appendResults(text) {
  var results = document.getElementById('results');
  results.appendChild(document.createElement('P'));
  results.appendChild(document.createTextNode(text));
}


function display(data) {
 console.log(data);
} 


var parseXml;

if (typeof window.DOMParser != "undefined") {
    parseXml = function(xmlStr) {
        return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
    };
} else if (typeof window.ActiveXObject != "undefined" &&
       new window.ActiveXObject("Microsoft.XMLDOM")) {
    parseXml = function(xmlStr) {
        var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlStr);
        return xmlDoc;
    };
} else {
    throw new Error("No XML parser found");
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














