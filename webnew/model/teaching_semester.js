var mongoose = require('mongoose');

//define schema for year study schema
var semesyearSchema = mongoose.Schema({

	ac_id: String,
	Year : Number,
	semester : Number,
	subject : [String]		
	
});

// create the model for year and expose it to our app
module.exports = semesyearSchema;