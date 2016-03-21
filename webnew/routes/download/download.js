var express = require('express');
var path = require('path');
var router = express.Router();
var schemas = require('utility/schemaLoader')(require('lib/dmsDb'));

router.get('/document/:file', isGranted, function(req, res) {
	var file = path.resolve('uploads/document/' + req.params.file);
	console.log('request file: ' + file);
	res.download(file);
});

/*
Check whether user have permission to download a file
	- User must have already logged in to the system
	- User must own that file or the file can be downloaded by any members
*/
function isGranted(req, res, next) {
	isMyFile(req, res, next);
}

/*
Check whether user owns the destinated file
If user doesn't own the file, redirect to root
*/
function isMyFile(req, res, next) {
	var user = req.user;
	var filename = req.params.file;

	var query = schemas.Document.findOne({
		'personReceive': user,
		'name': filename
	});

	query.exec(function(err, _docs) {
		if(err) {
			var err = new Error(err);
			err.status = 500;
			return next(err);
		}

		console.log(_docs);
		if(!_docs)
			res.redirect('/home');
		else
			return next();
	});
}

module.exports = router;
