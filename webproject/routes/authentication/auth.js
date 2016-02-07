module.exports = function(app, passport) {
    route_login(app, passport);
    route_logout(app);
}

function route_login(app, passport) {
    
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists     
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
}

function route_logout(app) {
    app.get('/logout', function(req, res) {
        console.log("Get logout");
        req.logout();
        res.redirect('/');
    });
}