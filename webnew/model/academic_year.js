var mongoose = require('mongoose');

//define schema for year study schema
var acyearSchema = mongoose.Schema({

	academic_year : Number,
	program_name : String,
	
	
});

// create the model for year and expose it to our app
<<<<<<< HEAD
module.exports = mongoose.model('Acyear', acyearSchema);
=======
module.exports = acyearSchema;
>>>>>>> parent of e5f5e9e... [refactor] compile schemas in the file itself and include them just like what we did with mongoose
