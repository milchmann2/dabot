var irc = require('irc');
var fs = require('fs');
var data = require('./data');

var channel;

var config = {
	
	channels: ["#dabot"],
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
	channel = to;
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
	var status = data.addUser(user);
	if (status === 0){
		bot.say(to, "Added new user!");
	}else if (status === -1){
		bot.say(to, "User already exists!");
	}
}

function addAlias(user, alias){
	var status = data.addAlias(user, alias);
	if (status === 0){
		bot.say(to, "Added new alias for + " + user + "!");
	}else if (status === -1){
		bot.say(to, "User doesn't exist! Can't add alias for unknown user!");
	}
}

function addNote(fromUser, toUser, msg){
	var status = data.addNote(fromUser, toUser, msg);
	if (status == true){
		bot.say(to, "Added your note! Woooooooooo \o/")
	}
	else
	{
		bot.say(to, "Couldn't add your note for whatever reason O_O")
	}
}

function checkNotes(user){
	return data.checkNotes(user);
}

function returnNotes(user){
	return data.returnNotes(user);
}