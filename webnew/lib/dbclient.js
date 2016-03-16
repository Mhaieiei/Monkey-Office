var db;

exports.set = function(database) {
	if(!db)
		db = database.createClient();
	return db;
}

exports.db = function() {
	return db;
}