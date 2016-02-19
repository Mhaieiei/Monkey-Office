// app/models/faculty.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our faculty model
var facSchema = mongoose.Schema({

	programname: String,
	sub_program: [String]
	
});


facSchema.methods.editProgram = function(request, response){
	console.log("Mhai eiei");
	this.programname = request.body.program_head_name;
	this.sub_program = request.body.sub_program;
	
	 
	this.save(function (err) {
        if(err) {
            console.error('ERROR!');
        }
		
    });
	 
	response.redirect('/programs');
};



// create the model for users and expose it to our app
module.exports = mongoose.model('Faculty', facSchema);













