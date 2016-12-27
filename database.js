var sqlite3 = require('sqlite3').verbose();

var database = function(){
	this.db = new sqlite3.Database('database.db'); 

};

database.prototype.initialize = function(){
	this.db.serialize(function() {
		this.run("CREATE TABLE if not exists channel_log (time TEXT, user TEXT, message TEXT)");
		this.run("CREATE TABLE if not exists channel_notes (time TEXT, from_user TEXT, to_user TEXT, message TEXT)");
		this.run("CREATE TABLE if not exists channel_users (name TEXT, alias TEXT)");

	});
	console.log("initialize");
};	


database.prototype.close = function(){
	this.db.close();
};

database.prototype.insertLog = function(user, message){
	var date = new Date().toLocaleDateString();
	var time = new Date().toLocaleTimeString();
	var datetime = date + " " + time;
	//var time = new Date();
	var stmt = this.db.prepare("INSERT INTO channel_log (time, user, message) VALUES (?, ?, ?)");
	stmt.run(time, user, message);
};

database.prototype.insertNote = function(from, to, message){
	var time = new Date();
	//var date = new Date().toLocaleDateString();
	//var time = new Date().toLocaleTimeString();
	//var datetime = date + " " + time;
	var stmt = this.db.prepare("INSERT INTO channel_notes (time, from_user, to_user, message) VALUES (?, ?, ?, ?)");
	stmt.run(time, from, to, message);
}

database.prototype.retrieveNotes = function(user){
	notes = [];
	this.db.each("SELECT time, from_user, to_user, message FROM channel_notes", function(err, row){
		var note = {
			time: row.time,
			from: row.from_user,
			to: row.to_user,
			message: note.message

		};
		notes.push(note);
		console.log(note);
	});
	this.deleteNotes(user);
	return notes;
}

database.prototype.deleteNotes = function(user){
	var stmt = this.db.prepare("DELETE FROM channel_notes WHERE to_user = (?)");
	stmt.run(user);
}

database.prototype.printEntries = function(){
	// this.db.each("SELECT rowid AS id, time, message, user FROM channel_log", function(err, row){
	// 			console.log(row.id + ": " + row.time + " - " + row.user + " " + row.message);
	// 		});

	// this.db.each("SELECT rowid AS id, time, message, from_user, to_user FROM channel_notes", function(err, row){
	// 			console.log(row.id + ": " + row.time + " - " + row.from_user + " " + row.to_user + " " + row.message);
	// 		});	

	this.db.each("SELECT name, alias FROM channel_users", function(err, row){
			console.log(row.name + ": " + row.alias);
		});	
}

database.prototype.getAllUsers = function(){
	var users = [];
	this.db.each("SELECT name, alias FROM channel_users", (err, row) => {
		if (err){
			return;
		}
		var user = {
			name: row.name,
			alias: row.alias
		};
		users.push(user);
		return users;
	});
	users.forEach(function(entry){
		console.log(entry);
	});
// TODO
//########
//##########

	
}

/*
database.prototype.getAllUsers = function(){
	var users = [];
	var that = users;
	this.db.each("SELECT name, alias FROM channel_users", function(err, row){
		console.log(that);
		var user = {
			name: row.name,
			alias: row.alias
		};
		users.push(user);

	});
	users.forEach(function(entry){
		console.log(entry);
	});
// TODO
//########
//##########

	return users;
}
*/

database.prototype.getAllNotes = function(){
	var messages = {};
	this.db.each("SELECT time, from_user, to_user, message FROM channel_notes", function(err, row){
		

		if (row.to_user in messages){
			var note = {
				from: row.from_user,
				time: row.time,
				note: row.message
			};
			messages[row.to_user].notes.push(note);
		}
		else{
			var new_user = {
				user: row.to_user,
				notes: []
			};
			var note = {
				from: row.from_user,
				time: row.time,
				note: row.message
			};
			new_user.notes.push(note);
			messages[row.to_user] = new_user;
		}
	});
};

database.prototype.addUser = function(user){
	this.db.all("SELECT name, alias FROM channel_users WHERE name = \"" + user + "\"", (err, row) => {
			if (err || Object.keys(row).length != 0){
				return;
			} 
			else{
				this.db.prepare('INSERT INTO channel_users (name, alias) VALUES (?, ?)').run(user, '');
			}
		});	
};



database.prototype.addAlias = function(user, alias){
	var stmt = this.db.prepare("SELECT alias FROM channel_users WHERE name = \"" + user + "\"");
	this.db.each("SELECT name, alias FROM channel_users WHERE name = \"" + user + "\"", function(err, row){


	})

	/* 
		##### TODO
	*/

	// var alias = stmt.run(user);
	// console.log(alias);
	// console.log("---------------");
	// if (!alias)
	// {
	// 	return null;
	// }
	//alias += ";" + alias;
	//stmt = this.db.prepare("UPDATE channel_users set alias = \"" + alias + "\" WHERE name = \"" + user + "\"");
}

module.exports = database;

/*




			var stmt = db.prepare("INSERT INTO user_info VALUES (?)");
			stmt.run("test" + 3);
			stmt.run("zwei" + 2);


stmt.finalize();

			db.each("SELECT rowid AS id, info FROM user_info", function(err, row){
				console.log(row.id + ": " + row.info);
			});



*/