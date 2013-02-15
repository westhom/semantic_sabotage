
var socket;

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
  var d = args.delay ? parseFloat(args.delay) : 10;
  if (args.docName) {
  	connect(args.docName, d);
  }
  
	var json = $.getJSON("http://sosolimited.com/eyeo_messages/_d0");
  var obj = JSON && JSON.parse(json) || $.parseJSON(json);
  console.log(obj.count);
  
}



// Connect via engine.io, send loadDoc message if docName is specified in URL args.
function connect() {
	console.log('connected');
	
	socket = new eio.Socket({ host: location.hostname, port: 8081 });

	// Send up options.
	socket.send(JSON.stringify({
	  event: "loadDoc",
	
	  data: {
	    // Pass up the document name if it's set.
	    docName: args.docName,
	
	    // delay between each char chunk
	    delay: d
	  }
	}));
	
  socket.on("message", function(msg) {
  	message(msg);
	});
}

// Handle incoming messages and distribute to appropriate functions.
function message(data) {

	data = JSON.parse(data);
	
	switch(data.type) {
		case 'live':
			console.log('live');
			break;
		case 'word':
			handleWord(data);
			break;
		case 'sentenceEnd':
			handleSentenceEnd(data);
			break;
		case 'stats':
			handleStats(data);
			break;
		default:
			break;
	}
}


// Handle incoming word message.
function handleWord(msg) {
	console.log('word');
	$('#words').append(msg.word);
}

// Handle incoming sentenceEnd message.
function handleSentenceEnd(msg) {
	console.log('sentenceEnd');	
}

// Handle incoming stats message.
function handleStats(msg) {
	console.log('stats');
}