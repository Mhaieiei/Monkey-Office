// JavaScript source code
var db = require('../lib/dbclient').db();
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
    role: db.model('role', roleSchema, 'role'),
    roleOfProgram: db.model('roleOfProgram', roleOfProgramSchema, 'role'),
    roleOfFaculty: db.model('roleOfFaculty', roleOfFacultySchema, 'role'),
    roleOfStaff: db.model('roleOfStaff', roleOfStaffSchema, 'role')
}