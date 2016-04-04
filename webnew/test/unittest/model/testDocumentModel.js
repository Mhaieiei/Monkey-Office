var rootpath = require('rootpath')();
var expect = require('chai').expect;

var dbMock = require('test/dbTestConfig');
var app = require('app')(dbMock);


describe('Test document model', function() {

	var User, Doc;
	var doc1, doc2, doc3, doc4;
	var document;
	var userJoe;

	before(function(done) {
		User = require('model/user');
		Doc = require('model/document');
		userJoe = new User({
			_id: 0,
			local: {
				name: 'joe'	
			}
		});
		userJoe.save();
		userDoe = new User({
			_id: 1,
			local: {
				name: 'doe'	
			}
		});
		userDoe.save(done);
	});

	before(function() {
		// add dummy data
		doc1 = new Doc({
			'owner': userJoe,
			'name': 'x_doc1',
		});

		doc2 = new Doc({
			'owner': userDoe,
			'name': 'x_doc2',
		});

		doc1.save(errorCallback);
		doc2.save(errorCallback);
		this.timeout(dbMock.dbTimeout);
	})

	after(function(done) {
		dbMock.dropDb(done);
	});

	describe('static methods', function() {

		it('Should find documents owned', function(done) {
			var query = Doc.findByUser(userJoe);
			query.exec(function(err, docs) {
				if(err)
					throw err;

				expect(docs.length).to.equal(1);
				for(var n = 0; n < docs.length; ++n) {
					var personId = docs[n].owner;
					expect(personId).to.equal(userJoe._id);
				}
				
				done();
			});
		});
	});

	describe('instance methods', function() {

		before(function(done) {
			Doc.findOne({owner: userJoe}).exec(function(err, doc) {
				errorCallback(err);

				if(!doc)
					throw 'Document not found';

				document = doc;
				done();
			});
		});

		it('Should set document\'s status to "created"', function() {
			document.created();
			expect(document.getStatus()).to.equal('create');
		});

		it('Should set document\'s status to "in progress"', function() {
			document.inProgress();
			expect(document.getStatus()).to.equal('inprogress');
		});

		it('Should set document\'s status to "done"', function() {
			document.done();
			expect(document.getStatus()).to.equal('done');
		});
	});
});

function expectAuthorToHaveDoc(query, docs, done) {
	query.exec(function(err, docs) {
		if(err)
			throw err;
		
		expect(docs.length).to.equal(docs.length);
		done();
	});	
}

var errorCallback = function(err) {
	if(err)
		throw err;
}