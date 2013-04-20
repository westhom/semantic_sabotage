// add html overlay elts to page
// PEND: change this to load html file
var newdiv = document.createElement('div'); 
newdiv.setAttribute('id','sabotage');
var wordsdiv = document.createElement("div");
wordsdiv.setAttribute('id', 'words');
newdiv.appendChild(wordsdiv);
document.body.appendChild(newdiv);


// inject scripts into current webpage

var scripts =  ["jquery-1.9.1.min.js", "localStorageDB/localstoragedb.min.js", "LIWC/LIWC.js", "statsHandler.js", "parser.js", "player.js", "fill.js", "sabotage.js"];

for (var i=0; i<scripts.length; i++) {

	var s = document.createElement('script');
	s.src = chrome.extension.getURL(scripts[i]);
	console.log("loading "+scripts[i]);
	s.onload = function() {
	   this.parentNode.removeChild(this);
	};
	(document.head||document.documentElement).appendChild(s);

}