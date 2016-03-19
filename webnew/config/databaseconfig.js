/*
This is a template for database configuration file

To use this file, please make sure to
	1. Copy-paste this file in the same directory
	2. Remove .template extension
	3. Please fill in information in required parameters
*/

//'mongodb://localhost:27017/nodewebapp'

/* Required parameters */
var host = 'localhost';
var port = '27017';
var database = 'nodewebapp';

/* Optional parameters */
var username = '';
var password = '';

/* -------------------------- */
exports.host = host;
exports.port = port;
exports.database = database;
exports.username = username;
exports.password = password;
