var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/document/:file', function(req, res) {
	var file = path.resolve('uploads/document/' + req.params.file);
	console.log('request file: ' + file);
	res.download(file);
});

module.exports = router;
