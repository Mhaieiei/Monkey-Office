var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	description: String,
	xml: String
});

module.exports = schema;