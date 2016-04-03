var rootpath = require('rootpath')();
var expect = require('chai').expect;
const assert = require('assert');

var dbMock = require('test/dbTestConfig');
var app = require('app')(dbMock);

module.exports = function() {

	it('documentID should start at 1', function() {
		createDoc(function(doc) {
			expect(doc.docNum).to.equals(1);
		});
	});

	function createDoc(then) {
		var AcademicAdminDoc = require('model/document/department/academic/academicAdministration');
		doc = new AcademicAdminDoc({
			name: 'AcademicAdminDoc'
		});
		doc.save(function(err) {
			assert.ifError(err);
			then(doc);
		});	
	}
};