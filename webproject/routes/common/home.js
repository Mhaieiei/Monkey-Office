var auth = require('../../middlewares/auth');

module.exports = function(app) {
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
	    res.render('welcome.hbs',{layout:"main"});
	});

	// Get path images
	app.get('/image.png', function (req, res) {
			res.sendfile(path.resolve('uploads/image_'+req.user._id+'.jpg'));
	});
	app.get('/imagelogo.jpg', function (req, res) {
			res.sendfile(path.resolve('public/images/monkey.jpg'));
	});
	app.get('/db.jpg', function (req, res) {
			res.sendfile(path.resolve('public/images/db.jpg'));
	});
	app.get('/qa.jpg', function (req, res) {
			res.sendfile(path.resolve('public/images/qa.jpg'));
	});
	app.get('/wf.jpg', function (req, res) {
			res.sendfile(path.resolve('public/images/wf.jpg'));
	});

	 // =====================================
    // HOME SECTION =====================
    // =====================================
       app.get('/home', auth.isLoggedIn, function(req, res) {
		console.log("Get home");
		res.render('home.hbs',{
			layout:"homeMain",
			user : req.user
		});
       // res.render('home.ejs', {
       //      user : req.user // get the user out of session and pass to template
       //  });
    });
}
