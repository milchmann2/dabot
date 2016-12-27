
var database = require('./database.js');

var db = new database();
db.initialize();



var users_2 = [];
var users = db.getAllUsers(function(err, rows){
		console.log("callback");
		var us = [];
		if (err){
			return;
		}
		rows.forEach(function(row){

			var user = {
				name: row.name,
				alias: row.alias
			};
			users_2.push(user);	
		})
		console.log(users_2);
		return users_2;
	
});
//var notes = db.getAllNotes();

console.log(users_2);
console.log(users);

//db.addUser("Jeffry");
// db.addAlias("martin", "mescht");

//db.insertLog("eins", "zwei");
//db.insertNote("martin", "andrei", "Hallo!");
//db.printEntries();

//db.printEntries();

//var a = db.retrieveNotes("andrei");

//nsole.log(a);