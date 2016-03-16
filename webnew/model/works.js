// app/models/works.js
// load the things we need
var mongoose = require('mongoose');
//var extend = require('mongoose-schema-extend');
var bcrypt   = require('bcrypt-nodejs');



// define the schema for our user model
var workSchema = mongoose.Schema({
	acyear : String	
});

var projectSchema = mongoose.Schema({
	_type: {type: String, default: 'Thesis'},
	nametitle : String,
	acyear : String,
	user : [{
		iduser : {type: String,ref:'User'},
		typeuser : String,
	}]
	// advisee : [{type: String,ref:'User'}],
	// advisor :{type: String,ref:'User'},
	// coadvisor : [{type: String,ref:'User'}],
	// examiner : [{type: String,ref:'User'}],	
});

var publicResearchSchema = mongoose.Schema({
    lecturer:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    researchName: String,
    academicYear: { type: mongoose.Schema.Types.ObjectId, ref: 'Acyear' },
    partners: [String],
    publishOn: String,
    level: String,
    nameOfConferenceJournal: String,
    type: String, //national Conference, international conference..
    referenced: [{
        type: String,
        agenciesOrganizationCommunity: String,
        utilization: String,
        monthAndYearToUse: String,

    }]
});

// var Work = mongoose.model('Work', workSchema, 'works');
// var exports = module.exports = Work;
// Work.Project = mongoose.model('Project', projectSchema, 'works');

module.exports = {
    Work: workSchema,
    Project: projectSchema,
    Public: publicResearchSchema,    
};


//module.exports = workSchema;
// create the model for users and expose it to our app
//module.exports = mongoose.model('Work', workSchema);
//module.exports = mongoose.model('Thesis', thesisSchema);












<<<<<<< HEAD
=======
module.exports = workSchema;
>>>>>>> parent of e5f5e9e... [refactor] compile schemas in the file itself and include them just like what we did with mongoose


