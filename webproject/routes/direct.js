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



var auth = require('../middlewares/auth');

module.exports = function(app, passport) {

	require('../controllers/common/home')(app);
	require('../controllers/authentication/auth')(app, passport);
    require('../controllers/authentication/signup')(app, passport);
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

    require('../controllers/user/profile')(app);
    require('../controllers/user/admin')(app);

	

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
		
	app.get( '/tqf21',auth.isLoggedIn, function( req, res ) {
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
	app.get( '/tqf22',auth.isLoggedIn, function( req, res ) {
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
	app.get('/work_inf',auth.isLoggedIn,function(req,res){
		console.log("Get Work Information");
		res.render('profile/workinfo.ejs', {
            user : req.user, // get the user out of session and pass to template		
			//work : req.works
        });
	});
	app.get('/addwork',auth.isLoggedIn,function(req,res){
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
	
	
	require('../controllers/workflow/workflow')(app);
};
