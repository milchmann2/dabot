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

database.prototype.getUsers = function(){
	var users = []
	this.db.each("SELECT name, alias FROM channel_users", function(err, row){
		var user = {
			name: row.name,
			alias: row.alias
		};
		users.push(user);
	});
	return	users;
}



database.prototype.addUser = function(user){
	console.log("this1: " + this.db);
	// this.db.serialize(function() {
		this.db.all("SELECT name, alias FROM channel_users WHERE name = \"" + user + "\"", function(err, row){
				console.log("err: " + err);
				console.log("row: " + row.name);
				if (err || !row){
					existsCheck("error", null);
				} 
				else{
					existsCheck(null, user);
				}
			});	
	// });


	var existsCheck = function(err, user){
		console.log("this2: " + this.db)
		if (err){
			console.log("duplicate");
			return;
		}
		else {
			console.log(this.db);
			//db.all("SELECT name, alias FROM channel_users WHERE name = \"" + user + "\"", function(err, row){console.log("ASDASDSAD")});
			var stmt = this.db.prepare("INSERT INTO channel_users (name, alias) VALUES (?, ?)");
			stmt.run(user, "");
		}
	};
};



database.prototype.addAlias = function(user, alias){
	var stmt = this.db.prepare("SELECT alias FROM channel_users WHERE name = \"" + user + "\"");
	this.db.each("SELECT name, alias FROM channel_users WHERE name = \"" + user + "\"", function(err, row){
		//console.log(err);

		console.log(row.name);
	})

	

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