var irc = require("irc");
var database = require('./database.js');

var db = new database();
db.initialize();

var config = {
	channels: ["#neverknowsbest australiansareleakers"],
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


bot.addListener("message", function(from, to, text, message){
	db.insertLog(from, text);
});

