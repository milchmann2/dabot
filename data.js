var fs = require('fs');

var userPath = "./data/users/";
var notePath = "./data/notes/";

var alias = {};

module.exports.addUser = function(user){
	if (fs.existsSync(userPath + user + ".txt")){
		return -1;
	}else{
		var usr = {
			user: user,
			alias: []
		};
		fs.writeFile(userPath + user + ".txt", JSON.stringify(usr));
		alias[user] = user;
		return 0;
	}
}

module.exports.addAlias = function(user, newAlias){
	if (!fs.existsSync(userPath + user + ".txt")){
		return -1
	}else{
		var file = fs.readFileSync(userPath + user + ".txt");
		var usr = JSON.parse(file);
		usr.alias.push(newAlias);
		fs.writeFile(userPath + user + ".txt", JSON.stringify(usr));
		alias[newAlias] = user;
		return 0;
	}
}

module.exports.addNote = function(fromUser, toUser, msg){
	if (toUser in alias)
	{
		var toUser = alias[toUser];

		if (!fs.existsSync(notePath + toUser + ".txt")){
			var note = {
				notes: [{
					from: fromUser,
					message: msg
				}]
			}
			fs.writeFile(notePath + toUser + ".txt", JSON.stringify(note));	
		} else{
			var file = fs.readFileSync(notePath + toUser + ".txt");
			var notes = JSON.parse(file);
			var note = {
				from: fromUser,
				message: msg
			}
			notes.notes.push(note);
			fs.writeFile(notePath + toUser + ".txt", JSON.stringify(notes));
		}
	}else{
		console.log("" + userPath + toUser + ".txt");
		return false;
	}
	return true;
}

module.exports.returnNotes = function(user){
	var user = alias[user];
	if (!fs.existsSync(notePath + user + ".txt")){
		return;
	}else{
		console.log("notes there2");
		var notes = fs.readFileSync(notePath + user + ".txt", 'utf8');
		notes = JSON.parse(notes);
		console.log(notes);
		fs.unlinkSync(notePath + user + ".txt");
		console.log(notes);
		return notes.notes;
	}
}

module.exports.checkNotes = function(user){
	if (user in alias){
		var user = alias[user];
		if (fs.existsSync(notePath + user + ".txt")){
			return true;
		}
	}
}

module.exports.loadAlias = function(){
	files = fs.readdirSync(userPath);
	files.forEach(function(entry){
		var file = fs.readFileSync(userPath + entry);
		var user = JSON.parse(file);
		user.alias.forEach(function(userAlias){
			alias[userAlias] = user.user;
		})
		alias[user.user] = user.user;
	})
}