
var database = require('./database.js');

var db = new database();
db.initialize();




var users = db.getAllUsers();
var notes = db.getAllNotes();

users.forEach(function(entry){
	console.log(entry);
});
//db.addUser("Jeffry");
// db.addAlias("martin", "mescht");

//db.insertLog("eins", "zwei");
//db.insertNote("martin", "andrei", "Hallo!");
//db.printEntries();

//db.printEntries();

//var a = db.retrieveNotes("andrei");

//nsole.log(a);