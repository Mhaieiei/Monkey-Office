var rootpath = require('rootpath')();
var expect = require('chai').expect;
const assert = require('assert');

var dbMock = require('test/dbTestConfig');
var app = require('app')(dbMock);

module.exports = function() {

	it('documentID should start at 1', function(done) {
		createDoc(function(doc) {
			expect(doc.docNum).to.equals(1);
			done();
		});
	});

	it('documentID should increment by 1', function(done) {
		createDoc(function(doc) {
			expect(doc.docNum).to.equals(2);
			done();
		});		
	})

	function createDoc(then) {
		var AcademicAdminDoc = require('model/document/department/DocumentFactory').academicAdministration;
		doc = new AcademicAdminDoc();
		doc.save(function(err) {
			assert.ifError(err);
			then(doc);
		});	
	}
};