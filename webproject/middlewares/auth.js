// route middleware to make sure a user is logged in
var isLoggedIn = function(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
//route middleware to make sure user is logged in as Admin
var isAdmin = function(req,res,next){

	if(req.user.local.name == "admin")
		return next();

	res.redirect('/');
}

exports.isLoggedIn = isLoggedIn;
exports.isAdmin = isAdmin;