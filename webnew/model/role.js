// JavaScript source code

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var roleSchema = mongoose.Schema({
    acyear: String,
    _type: String
});

var roleOfProgramSchema = mongoose.Schema({


    "type": String,//development  committee
    "academicYear": String,
    "position": String,//chairman...
    "user": [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]


});

var roleOfStaffSchema = mongoose.Schema({


    "type": String,//academic , support staff
    "academicYear": String,
    "position": String,//lecturer, accountance
    "advancementOfCareer":String,
    "user": [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

});

var roleOfFacultySchema = mongoose.Schema({


    "type": String,
    "academicYear": String,
    "TimeOfWork": String,
    "user": [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]


});

module.exports = {

    role: roleSchema,
    roleOfProgram: roleOfProgramSchema,
    roleOfFaculty: roleOfFacultySchema,
    roleOfStaff: roleOfStaffSchema
}