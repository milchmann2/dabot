var irc = require('irc');
var fs = require('fs');
var data = require('./data');
var path = require ('path');

var channel;

if (process.argv.length < 3){
	console.log("Not enough parameters. Config file missing!");
}
var configFile = "./" + process.argv[2];
var config;
var configName;
if (fs.existsSync(configFile)){
	config = JSON.parse(fs.readFileSync(configFile, "utf8"));
	configName = "./" + path.parse(configFile).name;
	if (!fs.existsSync(configName)){
		fs.mkdirSync(configName);
		fs.mkdirSync(configName + "/users");
		fs.mkdirSync(configName + "/notes");
	}
	data.setConfig(configName);
}
else{
	console.log("Config file does not exist!");
	return;
}


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
		//console.log(from);
		var notes = returnNotes(from);
		for (var i = 0; i < notes.length; i++){
			var msg = notes[i];
			var delta = Math.abs(Date.now() - msg.time) / 1000;
			/////#####
			// test
			// calculate (and subtract) whole days
			var days = Math.floor(delta / 86400);
			delta -= days * 86400;
			// calculate (and subtract) whole hours
			var hours = Math.floor(delta / 3600) % 24;
			delta -= hours * 3600;
			// calculate (and subtract) whole minutes
			var minutes = Math.floor(delta / 60) % 60;
			delta -= minutes * 60;
			// what's left is seconds
			var seconds = delta % 60;  // in theory the modulus is not required
			/////@@@### test
			var time = '';
			if (days > 0){
				time += days + "days ";
			}
			if (hours > 0){
				time += hours + "hours ";
			}
			if (minutes > 0){
				time += minutes + "minutes ";
			}
			if (time.length > 0){
				time += ' ago, '
			}
			
			bot.say(to, from + " - " + time + msg.from + " says: " + msg.message);
		}
	}

	var op = text.charAt(0);
	if (op === "!"){
		var splitted = text.split(' ');
		var cmd = splitted.splice(0, 1)[0].substring(1);
		var msg = splitted.join(' ');

		if (cmd === "help" || cmd == "cmd"){
			help();
		}else if (cmd === "note"){
			var split = msg.split(' ');
			var toUser = split.splice(0, 1)[0].toLowerCase();
			var msg = split.join(' ');
			addNote(from, toUser, msg);
			//bot.say(to, response[rnd(0, response.length)]);
		} else if( cmd === "adduser"){
			addUser(msg.toLowerCase())
		} else if (cmd === "addalias"){
			var newAlias = msg.split(' ')[1];
			if (newAlias === undefined){
				bot.say(channel, "Please supply an alias!")
				return;
			}
			addAlias(msg.split(' ')[0].toLowerCase(), newAlias.toLowerCase());
		} else if (cmd === "users"){
			var users = returnUsers();
			bot.say(channel, users);
		} else if (cmd === "useralias"){
			var users = returnAliasFor(msg.toLowerCase());
			bot.say(channel, users);
		}
	}
});


function addUser(user){
	var status = data.addUser(user);
	if (status === 0){
		bot.say(channel, "Added new user!");
	}else if (status === -1){
		bot.say(channel, "User already exists!");
	}
}

function addAlias(user, alias){
	var status = data.addAlias(user, alias);
	if (status === 0){
		bot.say(channel, "Added new alias for " + user + "!");
	}else if (status === -1){
		bot.say(channel, "User doesn't exist! Can't add alias for unknown user!");
	}
}

function addNote(fromUser, toUser, msg){
	var status = data.addNote(fromUser, toUser, msg);
	if (status === true){
		bot.say(channel, "Added your note! Woooooooooo \\o/")
	}
	else
	{
		bot.say(channel, "Couldn't add your note for whatever reason O_O")
	}
}

function checkNotes(user){
	return data.checkNotes(user);
}

function returnNotes(user){
	return data.returnNotes(user);
}

function returnUsers(){
	return data.returnUsers();
}

function returnAliasFor(user){
	var alias = data.returnAliasFor(user);
	if (alias === -1){
		bot.say(channel, "Given user doesn't exist!");
	}else{
		return alias;
	}
}

function help(){
	var msg = "!adduser *user* ; !addalias *user* *alias* ; !note *user* *message* ; !users ; !useralias *user*";
	bot.say(channel, msg);
}