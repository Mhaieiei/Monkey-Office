var db = require('lib/dbclient').db();
var Doc = require('model/document');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(db);

var schema = new mongoose.Schema({
	docNum: Number
}, {discriminatorKey: 'department'});

var plugInOptions = {
	model: Doc.modelName,
	field: 'docNum',
	startAt: 1,
	incrementBy: 1
}
schema.plugin(autoIncrement.plugin, plugInOptions);

var academicAdministrationAbbriviation = 'CA';
module.exports = Doc.discriminator(academicAdministrationAbbriviation, schema);