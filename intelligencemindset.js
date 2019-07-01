// Code derived from Thomas Forth's original at http://tomforth.co.uk/genderbias/
var fixedWords = ["memory", "quick*", "inherent", "innate", "rarely studies", "never studies", "doctor", "engineer", "good grade*", "AP", "MENSA", "no effort", "genetics", "seemingly", "gene", "capacity", "genius", "eas*", "fast*", "iq", "einstein", "excellen\\w*", "superb", "sharp", "talent*", "effortless*", "naturally","born","gifted","bright","test*","grasp","recall","unique","concepts"];
var growthWords = ["hardworking", "passion", "curious", "potential", "growth", "studious", "work ethic", "work hard", "dedicated","dedicated with passion","practice","motivat*","flexible","improve","try","desire", "learn new things", "lifetime learner", "eager", "open-minded","open minded", "malleable", "explor*", "challenge","driven","diligent","thorough","interest","adapt","explore", "grow", "growth","push through","love of", "try again", "tries again", "give up", "desire to","willing to learn", "strive to understand","excited about learning", "learn from mistakes"];

function textChanged() {
	document.getElementById("foundgrowthWords").innerHTML = "";
	document.getElementById("foundfixedWords").innerHTML = "";
	
	var letterText = document.getElementById("recommendationLetter").value;
	var splitLetterText = letterText.split(" ");
	for (var i = 0; i < splitLetterText.length; i++) {
		letterWord = splitLetterText[i];
		for (var fixedCounter = 0; fixedCounter < fixedWords.length; fixedCounter++) {
			if (letterWord.toLowerCase().search(fixedWords[fixedCounter]) == 0) {
				document.getElementById("foundfixedWords").innerHTML += '<p>' + letterWord + '</p>';
			}
		}
		for (var growthCounter = 0; growthCounter < growthWords.length; growthCounter++) {
			if (letterWord.toLowerCase().search(growthWords[growthCounter]) == 0) {
				document.getElementById("foundgrowthWords").innerHTML += '<p>' + letterWord + '</p>';
			}
		}
	}
}

var examples = [];
function example() {
	var v = "My friend Eric. He is a genius. He learns things very fast and easily. He is on another level.";
	if(examples.length > 0){
		var i = Math.floor(Math.random()*examples.length);
		v = parseMarkdown(examples[i]);
	}
	document.getElementById("recommendationLetter").value = v;
	textChanged();
}

function parseMarkdown(data){
	if(typeof data==="string") data = data.split(/[\n\r]/);
	// If it looks like YAML we remove it
	start = 0;
	if(data[0].indexOf('---')==0){
		for(var i = 1; i < data.length; i++){
			if(data[i].indexOf('---')==0){
				start = i+1;
				if(data[i+1]=="") start++;
				continue;
			}
		}
	}
	var out = "";
	for(var i = start; i < data.length; i++){
		out += data[i]+'\n';
	}
	return out;
}

function getExamples(data){
	if(typeof data==="string") data = data.split(/[\n\r]/);
	var m,alt;
	var success = function(data,a){ if(data) examples.push(data); };

	for(var i = 0; i < data.length ; i++){
		m = data[i].match(/\* \[[^\]]+\]\(([^\)]+)\)/);
		if(m){
			alt = m[1].replace(/\.md/,".html");
			loadFILE('examples/'+m[1],success,{error:function(){ console.log('trying '+alt);loadFILE('examples/'+alt,success); }});
		}
	}
}
//loadFILE('examples/README.md',getExamples);

// Function to load a file (same domain)
function loadFILE(file,fn,attrs){
	if(!attrs) attrs = {};
	attrs['_file'] = file;
	var error = "";
	var xhr = new XMLHttpRequest();
	if(attrs.error && typeof attrs.error==="function") error = function(e){ attrs.error.call((attrs.context ? attrs.context : this),e,attrs) }
	if(error){
		xhr.addEventListener("error", error, false);
		xhr.addEventListener("abort", error, false);
	}
	xhr.onreadystatechange = function(){
		if(xhr.readyState==4){
			if(typeof fn==="function"){
				fn.call((attrs.context ? attrs.context : this),xhr.responseText,attrs);
			}
		}
	}
	xhr.open("GET", file, true);
	try {
		xhr.send();
	} catch(e) {
		if(error) attrs.error.call((attrs.context ? attrs.context : this),e,attrs);
	}
}
