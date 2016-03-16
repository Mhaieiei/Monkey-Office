var mongoose = require('mongoose');

//define schema for year study schema
var semesyearSchema = mongoose.Schema({

	ac_id: String,
	Year : Number,
	semester : Number,
	subject : [{
		subcode : {type: mongoose.Schema.Types.ObjectId,ref:'Subject'},
		enroll_num : mongoose.Schema.Types.Mixed,
	}]	
	
});



// create the model for year and expose it to our app
<<<<<<< HEAD
module.exports = mongoose.model('Yearstudy', semesyearSchema);
=======
module.exports = semesyearSchema;
>>>>>>> parent of e5f5e9e... [refactor] compile schemas in the file itself and include them just like what we did with mongoose
