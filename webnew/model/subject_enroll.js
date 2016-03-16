// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var subEnrollSchema = mongoose.Schema({	
    
	acid : String,
	sub_code : {type: mongoose.Schema.Types.ObjectId,ref:'Subject'},
	student	: [{
		yearattend : Number,
		userid : {type: String,ref:'User'},
		grade : String
	}]	

});


// create the model for users and expose it to our app
<<<<<<< HEAD
module.exports = mongoose.model('Subenroll', subEnrollSchema);
=======
module.exports = subEnrollSchema;
>>>>>>> parent of e5f5e9e... [refactor] compile schemas in the file itself and include them just like what we did with mongoose













