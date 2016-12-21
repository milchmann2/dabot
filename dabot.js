var config = {
	channels: ["#dabot"],
	server: "irc.quakenet.org",
	botName: "dabot"
};


var irc = require("irc");

var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels
});

bot.addListener("join", function(channel, who){
	bot.say(channel, who + " hi!");
});


bot.addListener("message", function(from, to, text, message){
	bot.say(config.channels[0], from + " " + to + " " + text);
});