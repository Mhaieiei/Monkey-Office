var auth = require('../../middlewares/auth');

module.exports = function(app) {
	      // =====================================
    // PROFILE SECTION =====================
    // =====================================
    app.get('/profile', auth.isLoggedIn, function(req, res) {
		console.log("Get profile");
		console.log(req.user.local.name);
		var name = req.user.local.name;
		var fac;
		if(name == "admin")
			fac = true;
		else
			fac = false;
		res.render('profile/userprofile.hbs',{
			layout:"profileMain",
			user : req.user,
			fac : fac
		});
        // res.render('profile/userprofile.ejs', {
        //     user : req.user // get the user out of session and pass to template
        // });
    });
    // =====================================
    // Get User Info. ==============================
    // =====================================
	app.get('/profile_inf', auth.isLoggedIn,function(req,res){
		console.log("Get profile information");		
		res.render('profile/profileinfo.hbs',{
			layout:"profileMain",
			user : req.user

		});
		
	});
    
	// =====================================
    // Edit Profile ========
    // =====================================
		app.get('/edit', auth.isLoggedIn, function(req, res) {
			console.log( "Get editprofile");
			res.render('profile/edit.hbs', {
				layout: "profileMain",
				user : req.user
			});
		});
		
		app.post('/edit', auth.isLoggedIn, function (req, res){
			console.log( "Post editprofile");
			user : req.user

		User.findOne({ 'local.email' : req.body.email }, function(err, user) {
				if (err){ 
					console.log("Upload Failed!");
					return done(err);}
				
				if (user){
						console.log(req.body.email);
						console.log(req.body.nameuser);
						console.log(user);
						console.log("eiei");
						user.updateUser(req, res)

				}
			});
			
  		});
	//=====================================
    // Get Education Info. ==============================
    // =====================================
	app.get('/education_inf', auth.isLoggedIn,function(req,res){
		console.log("Get education");
		console.log(req.user);
		res.render('profile/educationinfo.hbs', {
			layout: "profileMain",
            user : req.user, // get the user out of session and pass to template
            helpers: {
            inc: function (value) { return parseInt(value) + 1; }
        }			
        });
	});
	//add education_inf
	app.get('/addedu',auth.isLoggedIn,function(req,res){
		console.log("Add Education");
		res.render('profile/addeducation.hbs', {
			layout: "profileMain",
            user : req.user // get the user out of session and pass to template			
        });
	});
	
	app.post('/addedu',auth.isLoggedIn,function(req,res){
		console.log("Posttt Mhai eiei1234455678");

		User.update({ 'local.email' : req.body.email },
		{
		 "$push" : {
			"education" :  {
					 "level": req.body.level,
					 "degree": req.body.degree,
					 "university": req.body.university,
					 "year": req.body.year
				   } //inserted data is the object to be inserted 
			  }
			},{safe:true},
			  function (err, user) {
				if (err){console.log('mhaiiiiiii');}
			    else console.log(user);
		});
		res.redirect('/education_inf');
		
		
	});
	//edit education information.
	app.get('/editeducation',auth.isLoggedIn,function(req,res){
		var index =req.query.id;
		console.log("Get Edit education");
		console.log(req.query.id);
		res.render('profile/editedu.hbs', {
			layout: "profileMain",
            user : req.user, // get the user out of session and pass to template
			index : req.query.id,
			education : req.user.education[index]
        });
	});
	app.post('/editedu',auth.isLoggedIn,function(req,res){
		console.log("Edit education");
		console.log(req.query.id);
		user : req.user		
		User.findOne({'local.email' : req.body.email },{ education: 1}, function(err, user) {
					if (err){ 
						console.log("Upload Failed!");
						return done(err);}
					
					if (user){
							console.log(user);
							console.log("eiei");
							user.editEducation(req, res)
							
					}

			});
	});
	//delete education information.
	app.get('/deledu',auth.isLoggedIn,function(req,res){
		console.log("Delete Education");
		console.log(req.query.email);
		User.update({ 'local.email' : req.query.email },
		{
		 "$pull" : {
			"education" :  {
					 "_id": req.query.id,
					} //inserted data is the object to be inserted 
			  }
			},{safe:true},
			  function (err, user) {
				if (err){console.log('mhaiiiiiii');}
			    else console.log(user);
		});
		res.redirect('/education_inf');
		
		
	});

}