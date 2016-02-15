// app/models/works.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model

var workSchema = new mongoose.Schema({
	nameUser:	String,	
	
});
	
module.exports = workSchema;


