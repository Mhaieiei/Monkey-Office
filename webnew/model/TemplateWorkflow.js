var db = require('../lib/dbclient').db();
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	description: String,
	xml: String
});

module.exports = db.model('TemplateWorkflow', schema);