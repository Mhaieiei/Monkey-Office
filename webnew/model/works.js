// app/models/works.js
// load the things we need
var mongoose = require('mongoose');
//var extend = require('mongoose-schema-extend');


// define the schema for our user model
var workSchema = mongoose.Schema({
	acyear : String	
},{collection: 'work',discrimination : '_type'});

module.exports = workSchema;


