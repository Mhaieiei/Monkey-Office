/*
Singleton connection to DMS
Taking advantage of module caching
*/

var dmsDBConfig = require('../config/databaseconfig');
var mongoose = require('mongoose');

var conn2db = function() {

	var optArgs = {
		'user': dmsDBConfig.username,
		'password': dmsDBConfig.password
	}

	var dmsDB = mongoose.createConnection(
		dmsDBConfig.host,
		dmsDBConfig.database,
		dmsDBConfig.port,
		optArgs
	);
	
	return dmsDB;
}

module.exports = conn2db();