var rootpath = require('rootpath')();
var expect = require('chai').expect;
const assert = require('assert');

var dbMock = require('test/dbTestConfig');
var app = require('app')(dbMock);

module.exports = function() {

	var doc1;

	before(function(done) {
		AcademicAdminDoc = require('model/document/department/academic/academicAdministration');
		doc1 = new AcademicAdminDoc({
			name: 'AcademicAdminDoc'
		});
		doc1.save(function(err) {
			assert.ifError(err);
			done();
		});
	})

	it('documentID should start at 1', function() {
		expect(doc1.docNum).to.equals(1);
	});
};
