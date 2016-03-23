var db = require('../lib/dbclient').db();
var mongoose = require('mongoose');

//define schema for year study schema
var semesyearSchema = mongoose.Schema({

    ac_id: String,
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'structure' },
	Year : Number,
	semester : Number,
	subject : [{
		subcode : {type: mongoose.Schema.Types.ObjectId,ref:'Subject'},
		enroll_num : mongoose.Schema.Types.Mixed,
	}]	
	
});

var structureSchema = mongoose.Schema({

    plan: String,
    knowledgeBlock: [{ type: mongoose.Schema.Types.ObjectId, ref: 'KnowledgeBlock' }]


});

var KnowledgeBlockSchema = mongoose.Schema({

    type: String,
    creditRequired: Number,
    subjectType: String

});

module.exports = {
    TeachingSemester: db.model('Yearstudy', semesyearSchema),
    KnowledgeBlock: db.model('KnowledgeBlock', KnowledgeBlockSchema),
    Structure: db.model('structure', structureSchema)
}
