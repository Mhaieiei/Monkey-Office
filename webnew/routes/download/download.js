var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/document/:file', isGranted, function(req, res) {
	var file = path.resolve('uploads/document/' + req.params.file);
	console.log('request file: ' + file);
	res.download(file);
});

/*
Check whether user have permission to download a file
	- User must have already logged in to the system
	- User must own that document or the document can be downloaded by any members
*/
function isGranted(req, res, next) {
	var isLoggedIn = require('middleware/loginChecker');
	isLoggedIn(req, res, next);

	
}


module.exports = router;
