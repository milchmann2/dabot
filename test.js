
var database = require('./database.js');

var db = new database();
db.initialize();





db.addUser("andrei");
// db.addAlias("martin", "mescht");

//db.insertLog("eins", "zwei");
//db.insertNote("martin", "andrei", "Hallo!");
db.printEntries();

//db.printEntries();

//var a = db.retrieveNotes("andrei");

//nsole.log(a);