var irc = require('irc');
var fs = require('fs');
var data = require('./data');

var config = {
	channels: ["#neverknowsbest australiansareleakers"],
	//channels: ["#dabot"],
	server: "irc.quakenet.org",
	botName: "dabot"
};


var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels
});


/*
bot.addListener("join", function(channel, who){
	bot.say(channel, who + " hi!");
});
*/

data.loadAlias();

bot.addListener("message", function(from, to, text, message){
	
	var from = from.toLowerCase();
	if (checkNotes(from) === true){
		console.log(from);
		var notes = returnNotes(from);
		for (var i = 0; i < notes.length; i++){
			var msg = notes[i];
			bot.say(to, from + " - " + msg.from + " says: " + msg.message);
		}
	}

	var op = text.charAt(0);
	if (op === "!"){
		var splitted = text.split(' ');
		var cmd = splitted.splice(0, 1)[0].substring(1);
		var msg = splitted.join(' ');

		if(cmd === "note"){
			var split = msg.split(' ');
			var toUser = split.splice(0, 1)[0].toLowerCase();
			var msg = split.join(' ');
			addNote(from, toUser, msg);
			//bot.say(to, response[rnd(0, response.length)]);
		} else if(cmd === "adduser"){
			addUser(msg.toLowerCase())
		} else if(cmd === "addalias"){
			var newAlias = msg.split(' ')[1];
			if (newAlias === undefined){
				return;
			}
			addAlias(msg.split(' ')[0].toLowerCase(), newAlias.toLowerCase());
		}
	}
});


function addUser(user){

	data.addUser(user);
}

function addAlias(user, alias){
	data.addAlias(user, alias);
}

function addNote(fromUser, toUser, msg){
	data.addNote(fromUser, toUser, msg);
}

function checkNotes(user){
	return data.checkNotes(user);
}

function returnNotes(user){
	return data.returnNotes(user);
}