var rootpath = require('rootpath')();
var expect = require('chai').expect;
var assert = require('assert');
var dbMock = require('test/dbTestConfig');

describe('Database Collections Entity Testing', function() {

	before(function() {
		var app = require('app')(dbMock);
	})

	makeSuite('Document Model', function() {
		describe('Base Schema', require('./testDocumentModel'));
		describe('Document Sub Type', function() {
			var academicAdmin = require('model/document/department/DocumentFactory').academicAdministration;
			require('./document/department/testDocumentSubType')(academicAdmin);
		});
	});
})

function makeSuite(name, tests) {
	describe(name, function() {

		tests();

		// shared after
		after(function(done) {
			dbMock.dropDb(done);
		});		

	});
}