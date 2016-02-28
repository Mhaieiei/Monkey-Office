// app/models/works.js
// load the things we need
var mongoose = require('mongoose');
//var extend = require('mongoose-schema-extend');


// define the schema for our user model
var workSchema = mongoose.Schema({
	acyear : String	
},{collection: 'work',discrimination : '_type'});

// var thesisSchema = workSchema.extend({
// 	name : String,
// 	year : Number,
// 	advisee : [{type: mongoose.Schema.Types.ObjectId,ref:'User'}],
// 	advisor :{type: mongoose.Schema.Types.ObjectId,ref:'User'},
// 	co_advisor : [{type: mongoose.Schema.Types.ObjectId,ref:'User'}],
// })



// create the model for users and expose it to our app
module.exports = mongoose.model('Work', workSchema);
//module.exports = mongoose.model('Thesis', thesisSchema);














