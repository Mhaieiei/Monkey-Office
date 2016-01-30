 	// =====================================
    // Setting Model Databases ========
    // =====================================
var User  = require('../model/user');
var Work  = require('../model/works');
var Fac   = require('../model/faculty');
var Subject = require('../model/subject');
var Acyear = require('../model/academic_year');
var Teach = require('../model/teaching_semester');
var TemplateWorkflow 	= require('../model/TemplateWorkflow');
//var Handler		= require('./handler');
var path = require('path');
var fs = require('fs');
var exphbs = require('express3-handlebars');
//var busboy = require('connect-busboy');

 	// =====================================
    // Setting Workflow ========
    // =====================================
var parseString 		= require('xml2js').parseString;
var WorkflowHandler		= require('./WorkflowHandler');
var years = [2012,2013,2014,2015,2016];
var yearlevel = [1,2,3,4];

var date = new Date();
var current_year = date.getFullYear();
var index = 0;
var nametemp = "";


module.exports = function(app, passport) {

	require('../controllers/common/home')(app);
	
    // =====================================
    // LOGIN ===============================
    // =====================================
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
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
		console.log("Get logout");
        req.logout();
        res.redirect('/');
    });
	


    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: 'signupMessage' });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);
	app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
	 // =====================================
    // HOME SECTION =====================
    // =====================================
       app.get('/home', isLoggedIn, function(req, res) {
		console.log("Get home");
		res.render('home.hbs',{
			layout:"homeMain",
			user : req.user
		});
       // res.render('home.ejs', {
       //      user : req.user // get the user out of session and pass to template
       //  });
    });
      // =====================================
    // PROFILE SECTION =====================
    // =====================================
    app.get('/profile', isLoggedIn, function(req, res) {
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
	app.get('/profile_inf',isLoggedIn,function(req,res){
		console.log("Get profile information");		
		res.render('profile/profileinfo.hbs',{
			layout:"profileMain",
			user : req.user

		});
		
	});
    
	// =====================================
    // Edit Profile ========
    // =====================================
		app.get('/edit', isLoggedIn, function(req, res) {
			console.log( "Get editprofile");
			res.render('profile/edit.hbs', {
				layout: "profileMain",
				user : req.user
			});
		});
		
		app.post('/edit',isLoggedIn, function (req, res){
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
	app.get('/education_inf',isLoggedIn,function(req,res){
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
	app.get('/addedu',isLoggedIn,function(req,res){
		console.log("Add Education");
		res.render('profile/addeducation.hbs', {
			layout: "profileMain",
            user : req.user // get the user out of session and pass to template			
        });
	});
	
	app.post('/addedu',isLoggedIn,function(req,res){
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
	app.get('/editeducation',isLoggedIn,function(req,res){
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
	app.post('/editedu',isLoggedIn,function(req,res){
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
	app.get('/deledu',isLoggedIn,function(req,res){
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
	 // =====================================
    // Admin SECTION =====================
    // =====================================
    app.get('/admin',isLoggedIn,function(req,res){
		console.log("Get Admin");
		console.log(current_year);
		res.render('admin/home.hbs', {
			layout: "adminMain",
            user : req.user // get the user out of session and pass to template			
        });
	});
	app.get('/programs',isLoggedIn,function(req,res){
		console.log('Admin Get Program');
		console.log(years);
		console.log(years[0]);
		return Fac.find( function( err, faculty ) {
        if( !err ) {
			console.log(faculty);
            res.render("admin/faculty/program.hbs", {
            	layout: "adminMain",
            	user : req.user,
            	faculty: faculty,
            	year : years,
            	helpers: {
            	set: function (value) { index = value; },
            	get: function(){return index;},
            
            }
            });
        } else {
            return console.log( err+"mhaieiei" );
	        }
	    });
		
		
	});
	app.post('/programs',isLoggedIn,function(req,res){
		console.log("Admin Post Program");
		console.log(req.body.sub_programs);
		console.log(req.body.years);
		Acyear.findOne({ 
			$and: [
		             { 'program_name' :  req.body.sub_programs  },
		             { 'academic_year' : req.body.years }
		           ]
			
		}, function(err, ac) {
        
        if (err){
			console.log("Error ...1");
		}
        // check to see if theres already a user with that email
        if (ac) {
			console.log("There have table(s) to show");
			console.log(ac.id);
			res.redirect('/showprogram?id='+ac.id);

        } else {
           console.log("There not have table to show");
       	   res.redirect('/showprogram');
       	 }
       	});
	
  });
    
    app.get('/showprogram',isLoggedIn,function(req,res){
    	console.log("Admin get showprogram");
    	console.log(req.query.id);
    	return Teach.find({'ac_id' : req.query.id }, function( err, teachsemes ) {
        if( !err ) {
			console.log(teachsemes);
            res.render("admin/faculty/searchprogram.hbs", {
            	layout: "adminMain",
            	user : req.user,
            	teachsemes: teachsemes,
            	year : years,
            	helpers: {
            	set: function (value) { index = value; },
            	get: function(){return index;},
            
            }
            });
        } else {
            return console.log( err+"mhaieiei" );
	        }
	    });

    });

	app.post('/showprogram',isLoggedIn,function(req,res){
	console.log("Post show program");
	console.log(req.body.sub_programs);
	console.log(req.body.years);
	console.log(req.query.acid);	

		
 	});

	app.get('/addprogram',isLoggedIn,function(req,res){
		console.log("Admin Add Head program");
		res.render('admin/faculty/addprogram.hbs',{
			layout: "adminMain",
			user: req.user
		});
	});

	app.post('/addprogram',function(req,res){
		console.log("Admin Post add head program");
		console.log(req.body.program_head_name);
		console.log(req.body.sub_program);
		console.log(req.body.sub_program[0]);
		var sub_track = req.body.sub_program;
		console.log(sub_track.length);
		
		Fac.update({ 'fac_name' : "International College" },
		{
		 "$push" : {
			"program" :  {
					 "name_head_program" : req.body.program_head_name,
					 "sub_program" : req.body.sub_program
				   } //inserted data is the object to be inserted 
			  }
			},{safe:true},
			  function (err, program) {
				if (err){console.log('mhaiiiiiii');}
			    else console.log(program);
		});
		res.redirect('/programs');

	});

	app.get('/addsubprogram',isLoggedIn,function(req,res){
		console.log('Admin add Program');
		console.log(req.query.name);
		console.log(req.query.year);
		console.log(yearlevel);
		Acyear.findOne({ 
			$and: [
		             { 'program_name' :  req.query.name  },
		             { 'academic_year' : req.query.year }
		           ]
			
		}, function(err, ac) {
        
        if (err){
			console.log("Error ...1");
		}
        // check to see if theres already a user with that email
        if (ac) {
			console.log("That code is already have");
			res.render("admin/faculty/addsubprogram.hbs",{
						layout: "adminMain",
						user: req.user,
						name: req.query.name,
						cryear : req.query.year,
						acid: ac.id,
						yearlevel : yearlevel
			});
        } else {
            // if there is no user with that email
            // create the user
            var acYear        = new Acyear();

            // set the user's local credentials
			acYear.academic_year = req.query.year;
			acYear.program_name = req.query.name;
			
            // save the acyear
            acYear.save(function(err,acc) {
            	if (err){console.log('mhaiiiiiii');}
                else{
                 nametemp = acc.id;
                 console.log("Insert already"+ nametemp);
                 	res.render("admin/faculty/addsubprogram.hbs",{
						layout: "adminMain",
						user: req.user,
						name: req.query.name,
						acid: nametemp,
						yearlevel : yearlevel
					});
                }
            });
       	 }
		});
		
	});

	app.post('/addsubprogram',isLoggedIn,function(req,res){
		console.log("Posttt Add Program");
		console.log(req.body.nametrack);
		console.log(req.body.year);
		console.log(req.body.semes);
		console.log(req.body.acid);
		console.log(req.body.subject_code);
		
		
		console.log(nametemp);
		Teach.findOne({
		     $and: [
		             { 'Year' : req.body.year },
		             { 'semester' : req.body.semes }
		           ]
		    }, function(err, sub) {
            console.log(nametemp);
            if (err){
				console.log("Error ...1");
			}
            // check to see if theres already a user with that email
            if (sub) {
				console.log("That code is already have");
            } else {
                // if there is no user with that email
                // create the user
                var newTeach        = new Teach();

                // set the user's local credentials
				newTeach.ac_id = req.body.acid ;
				newTeach.Year = req.body.year;
				newTeach.semester = req.body.semes;
				newTeach.subject = req.body.subject_code;
			
                // save the user
                newTeach.save(function(err,teach) {
                    if (err){console.log('mhaiiiiiii');}
                    else console.log("Insert already"+ teach);
                });
            }

        });  

		res.redirect('/programs');
 	});

	
	app.get('/subjects',isLoggedIn,function(req,res){
		console.log('Admin Get Subject Home');
		//console.log(years);
		return Subject.find( function( err, subject ) {
        if( !err ) {
			console.log(subject);
            res.render("admin/faculty/subjecthome.hbs", {
            	layout: "adminMain",
            	user : req.user,
            	subjects: subject,
            	
            });
        } else {
            return console.log( err+"mhaieiei" );
	        }
	    });
		
		
	});
	app.get('/addsubjects',isLoggedIn,function(req,res){
		console.log('Admin Get Add Subject');
		console.log(years);
		return Fac.find( function( err, faculty ) {
        if( !err ) {
			console.log(faculty);
            res.render("admin/faculty/subject.hbs", {
            	layout: "adminMain",
            	user : req.user,
            	faculty: faculty,
            	year : years
            });
        } else {
            return console.log( err+"mhaieiei" );
	        }
	    });
		
		
	});
	app.post('/addsubjects',isLoggedIn,function(req,res){
		console.log("Posttt Add Subject");
		console.log(req.body.sub_code);
		console.log(req.body.lec_name);
		Subject.findOne({ 'sub_code' :  req.body.sub_code }, function(err, sub) {
            
            if (err){
				console.log("Error ...1");
			}
            // check to see if theres already a user with that email
            if (sub) {
				console.log("That code is already have");
            } else {
                // if there is no user with that email
                // create the user
                var newSub        = new Subject();

                // set the user's local credentials
				newSub.sub_code = req.body.sub_code;
				newSub.sub_name = req.body.sub_name;
				newSub.sub_credit = req.body.sub_credit;
               	newSub.sub_lecter = req.body.lec_name;	
                // save the user
                newSub.save(function(err,subject) {
                    if (err){console.log('mhaiiiiiii');}
                    else console.log("Insert already"+subject);
                });
            }

        });  
 		res.redirect('/subjects');
 	});

 		//delete subject information.
	app.get('/delsub',isLoggedIn,function(req,res){
		console.log("Delete Subject");
		console.log(req.query.id);
		//console.log(req.query.email);

		Subject.remove(
		      { 'sub_code' : req.query.id },
		      function(err, results) {
		        if (err){console.log('mhaiiiiiii');}
		 	    else console.log(results);
		      }
		   );
		res.redirect('/subjects');
		
	});
		//edit education information.
	app.get('/editsubject',isLoggedIn,function(req,res){
		var index =req.query.id;
		console.log("Admin Edit subject");
		console.log(req.query.id);

		return Subject.findOne({'sub_code' : req.query.id }, function( err, subject ) {
        if( !err ) {
			console.log(subject);
            res.render('admin/faculty/editsubject.hbs', {
              layout: "adminMain",
			  user : req.user,
              subject: subject,
              helpers: {
            	inc: function (value) { return parseInt(value) + 1; }
            }
            });
        } else {
            return console.log( err+"mhaieiei" );
	        }
	    });	
	});
	
	app.post('/editsubjects',isLoggedIn,function(req,res){
		console.log("Admin Edit subject");
		//console.log(req.query.id);
		//user : req.user		
		Subject.findOne({'sub_code' :  req.body.sub_code },
			function(err, sub) {
				if (err){ 
					console.log("Upload Failed!");
					return done(err);}				
				if (sub){
					console.log(sub);
					sub.editSubject(req, res)						
				}

			});
	});

	

	//=====================================
    // Get QA Info. ==============================
    // =====================================
    app.get('/qapage',function(req,res){
		console.log('Get QA Info(select program)');
		console.log(years);
		console.log(years[0]);
		return Fac.find( function( err, faculty ) {
        if( !err ) {
			console.log(faculty);
            res.render("qa/qapage.hbs", {
            	layout: "homeMain",
            	user : req.user,
            	faculty: faculty,
            	year : years,
            	helpers: {
            	set: function (value) { index = value; },
            	get: function(){return index;},
            
            }
            });
        } else {
            return console.log( err+"mhaieiei" );
	        }
	    });
		
		
	});

    app.post('/qahome',function(req,res){
	console.log('Get QA home(select Topic)');
	console.log(req.body.sub_programs);
	console.log(req.body.years);
	res.render('qa/qahome.hbs',{
			layout: "homeMain",
			user: req.user,
			programname: req.body.sub_programs,
			year: req.body.years
		});
	
		
	});

    app.post('/tqfhome',function(req,res){
	console.log('Get TQF home(select choice)');
	console.log(req.query.sub_programs);
	console.log(req.query.years);
	res.render('qa/tqfhome.hbs',{
			layout: "homeMain",
			user: req.user,
			programname: req.query.sub_programs,
			year: req.query.years
		});		
	});

    app.get('/tqf21',function(req,res){
		console.log('Get TQF21');
		console.log(req.query.program);
		console.log(req.query.year);
		return User.find({'local.faculty' : req.query.program }, function( err, clients ){
        if( !err ) {
			console.log(clients);
            res.render("qa/tqf21.hbs", {
            	layout: "homeMain",
            	user : req.user,
            	clients: clients,
            	programname: program,
              	year: year
            });
        } else {
            return console.log( err+"mhaieiei" );
	        }
	    });
		
		
	});
		
	app.get( '/tqf21',isLoggedIn, function( req, res ) {
		console.log( "Get TQF21");
		program = req.query.program;
		year = req.query.year;
		console.log(program);
		console.log(year);
		//find user in their programs
		return User.find({'local.faculty' : req.query.program }, function( err, clients ) {
        if( !err ) {
			console.log( "What happend here" );
			console.log(clients);
            res.render('qa/tqf21.ejs', {
			  user : req.user,
              clients: clients,
              programname: program,
              year: year
            });
        } else {
            return console.log( err+"mhaieiei" );
	        }
	    });
	});
	app.get( '/tqf22',isLoggedIn, function( req, res ) {
		console.log( "Get TQF22");
		program = req.query.program;
		year = req.query.year;
		console.log(program);
		
		return Fac.findOne({
	     $and: [
	            { 'program_name' : program },
	            { 'academic_year' : year }
	          ]
	   }, function( err, programs ) {
        if( !err ) {
        	console.log(programs);
			console.log( "What happend here" );
            res.render('qa/tqf22.ejs', {
			  user : req.user,
              program: programs,
              programname: program,
              year: year

            });
        } else {
        	//res.redirect('/fachome');
            return console.log( err+"mhaieiei" );
	        }
	    });
	 
	});
		
	
	
	//=====================================
    // Get Work Info. ==============================
    // =====================================
	app.get('/work_inf',isLoggedIn,function(req,res){
		console.log("Get Work Information");
		res.render('profile/workinfo.ejs', {
            user : req.user, // get the user out of session and pass to template		
			//work : req.works
        });
	});
	app.get('/addwork',isLoggedIn,function(req,res){
		console.log("Add Work Information");
		res.render('profile/addwork.ejs', {
            user : req.user, // get the user out of session and pass to template	
			work : req.works
        });
	});
	app.post('/addwork',function(req,res){
		console.log("Add work......");

		console.log(req.body.namework);
		console.log(req.body.details);
		var test = {
		    foo: "here be dragons",
		    bar: "foo is a lie"
		  };
		var array = {"nameofwork":"thesis2","detail":"thesis year"};
		//use JSON.stringify to convert it to json string
        var jsonstring = JSON.stringify(array);
        //convert json string to json object using JSON.parse function
        var jsonobject = JSON.parse(jsonstring);
		test = ["thesis","a","bb"];
		temp = "rhw";

		var i = 0;
		changes = { };
		changes["work."+i]= req.body.namework;
		changes["work."+i]= req.body.details;
		console.log(changes);
		Work.update({ 'nameUser' : req.query.email },
		{
			$push : changes			  
			},{safe:true},
			  function (err, user) {
				if (err){console.log('mhaiiiiiii'+err);}
			    else console.log(user);
		});
			
		res.redirect('/work_inf');
		
	
	});
	
	
	//=====================================
    // Get Course Info. ==============================
    // =====================================
	app.get('/course_inf',function(req,res){
		res.render('profile_inf.ejs', { message: req.flash('profile') });
	});
	
	
	//=====================================
	// Workflow. ==============================
	// =====================================
	app.get('/workflow', function(req, res){
		res.render('wf/index.hbs',{
			layout:"workflowMain"
		});
	});

	app.get('/execute', function(req, res){
	TemplateWorkflow.find({}, function(err, result){

		if(err) console.log(err);

		res.render('wf/execute.hbs', 
			{ layout: "workflowMain",workflows : result });
		});

	});

	app.get('/create', function(req, res){
		res.render('wf/create.hbs',
			{layout:"workflowMain"});
	});

	app.post('/save', function(req, res){

		var tpWorkflow = new TemplateWorkflow( { 
			name: req.body.name, 
			description: req.body.description,
			xml: req.body.xml  
		} );
	
		tpWorkflow.save(function (err) {
			if(!err){
				console.log('Save template workflow !!!');
				res.end('succesful');
			}
			else{
				console.log(err);
				res.end('failed');
				}

		});
	});


	app.get('/:id/profile', function(req, res){
		
		TemplateWorkflow.findOne( { "_id" : req.params.id }, function(err, result){

			res.render('wf/single/profile.hbs', 
				{ layout:"workflowMain",workflow: result } );
		});	

	});


	app.get('/:id/execute', function(req, res){

		TemplateWorkflow.findOne( { "_id" : req.params.id }, function(err, result){
			var xml = result.xml;

			parseString(xml, function (err, strResult) {

				var elements = strResult["bpmn2:definitions"]["bpmn2:process"][0];
				var keys = Object.keys( elements );


				var handler = new WorkflowHandler();

			
				handler.setup( elements );
				handler.run();
		
	    		res.render( "workflow/single/execute.hbs", { 
	    			layout:"workflowMain",
	    			tasks : handler.taskList,
	    			id : req.params.id
	    		});
			});
		});
	});


	app.post('/:id/execute', function(req, res){

		res.end("DONE");

	});

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
//route middleware to make sure user is logged in as Admin
function isAdmin(req,res,next){

	if(req.user.local.name == "admin")
		return next();

	res.redirect('/');
}
