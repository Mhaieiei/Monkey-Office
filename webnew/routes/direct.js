//var Handler		= require('./handler');
var path = require('path');
var fs = require('fs');
var exphbs = require('express3-handlebars');
var async = require('async');

//var busboy = require('connect-busboy');
var Handlebars = require('handlebars/runtime')['default'];

Handlebars.registerHelper('select', function( value, options ){
        var $el = $('<select />').html( options.fn(this) );
        $el.find('[value="' + value + '"]').attr({'selected':'selected'});
        return $el.html();
    });

// Handlebars.registerHelper('select', function(selected, options) {
//     return options.fn(this).replace(
//         new RegExp(' value=\"' + selected + '\"'),
//         '$& selected="selected"');
// });


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




module.exports = function(app, passport, schemas) {
 	// =====================================
    // Setting Model Databases ========
    // =====================================
	var User  = schemas.User;
	var Work  = schemas.Work;

	var Fac   = schemas.Faculty;
	var Subject = schemas.Subject;
	var Acyear = schemas.AcademicYear;
	var Teach = schemas.TeachingSemester;
	var TemplateWorkflow 	= schemas.TemplateWorkflow;
	var Doc = schemas.Document;




    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    //app.get('/', function(req, res) {
    	//res.render('signin.ejs');
    //    res.render('signin.hbs',{layout:"main"}); // load the sigin.ejs file
    //});
	
	// Get path images
	app.get('/image.png', function (req, res) {
    		//res.sendfile(path.resolve('uploads/acnes.png'));
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
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/', function(req, res) {

        // render the page and pass in any flash data if it exists     
        res.render('index.ejs', { message: req.flash('loginMessage') }); 
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
       	var query = Doc.findByUser(req.user);
       	query.exec(function(err, _docs) {
       		if(err) {
       			console.log(err);
       			res.status(500);
       			return next(err);
       		}
       		
       		//console.log(_docs);

       		var response = {
       			layout: 'homepage',
       			docs: _docs,
       			date: {},
       			
       		}

       		for(var i = 0 ; i < response.docs.length ;++i){
       			var a = response.docs[i].dateCreate;
       			var mm = a.getMonth()+1;
       			var dd = a.getDate();
       			
       			if(mm<10){
       				mm = "0"+mm;
       			}
       			if(dd<10){
       				dd = "0"+dd;
       			}
       			
       			response.docs[i].date = a.getFullYear() + '-' +mm+'-'+dd;
       		}
       		
       		//response.docs[0].dateCreate =  a.getYear() + '/' +a.getMonth() +'/'+a.getDay()
       		
       		// console.log("update")
       		// console.log(response.docs[0].gun)
       		// response.docs[0].dateCreate = a
       		//response.docs.dateCreate[0].toString('ddd MMM yyy h:mm:ss')
       		
       		//console.log(esponse.docs.dateCreate[0].toString('ddd MMM yyy h:mm:ss'))
       		//console.log(response);
			res.render('home.hbs', response);
       	});

 	

	
    });

    app.post('/home', isLoggedIn, function(req, res) {
      console.log('AT HOME');
   		var documentName = req.body.doc_name;
   		var status = req.body.doc_status;
   		var fromDate = Date.parse(req.body.fromDate);
      var fDate = req.body.fromDate;
   		var toDate = Date.parse(req.body.toDate);
      var tDate = req.body.toDate;
   		var type = req.body.doc_type;
   		var author = req.body.doc_author;
   		var user = req.user;

   		var subStringRegex = function(subString, isCaseSensitive) {
   			var mode;
   			if(isCaseSensitive) mode = 'c';
   			else mode = 'i';

   			return new RegExp(subString, mode);
   		};
   		
   		var query = Doc.findByUser(user).
   		where('name').regex(subStringRegex(documentName, false));

   		if(!isNaN(fromDate) && !isNaN(toDate)) {
   			fromDate = new Date(fromDate);
   			toDate = new Date(toDate);
   			query = query.where('dateCreate').gt(fromDate).lt(toDate);
   		}

   		if(author) {
   			query = query.where('author').regex(subStringRegex(author, false));
   		}

   		if(status !== 'all') {
   			status = status.toLowerCase().trim();
   			query = query.where('status').equals(status);
   		}

   		console.log("Status:"+status);

   		query.exec(function(err, _docs) {
       		if(err) {
       			console.log(err);
       			res.status(500);
       			return next(err);
   			}

      console.log("Type: " + type);
      var status1;
      var status2;
      var status3;
      var type1;
      var type2;

      if (status == 'create') {
        status1 = true;
      } else if (status == 'inprogress'){
        status2 = true;
      } else if (status == 'done'){
        status3 = true;
      }

      if (type == 'own'){
        type1 = true;
      } else if (type = 'other_type'){ 
        type2 = true;
      }

      console.log('s1:'+status1);
      console.log('s2:'+status2);
      console.log('s3:'+status3);
			var response = {
       			layout: 'homepage',
       			docs: _docs,
       			date: {},
            docName: documentName,
            docAuthor: author,
            docStatus: status,
            docFromDate: fDate,
            docToDate: tDate,
            docType: type,
            st1: status1,
            st2: status2,
            st3: status3,
            type1: type1,
            type2: type2
   			}
   			
       		for(var i = 0 ; i < response.docs.length ;++i){
       			var a = response.docs[i].dateCreate;
       			var mm = a.getMonth()+1;
       			var dd = a.getDate();
       			
       			if(mm<10){
       				mm = "0"+mm;
       			}
       			if(dd<10){
       				dd = "0"+dd;
       			}
       			
       			response.docs[i].date = a.getFullYear() + '-' +mm+'-'+dd;
       		}
   		
			res.render('home.hbs', response); 
   		});
   });

    app.get('/document', isLoggedIn, function(req, res){
      console.log("Document Information");
      res.render('dms/document.hbs');
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
		res.render('profile/profile.hbs',{
			layout:"profilePage",
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
			res.render('profile/profileedit.hbs', {
				layout: "profilePage",
				user : req.user
			});
		});

		
		app.post('/edit',isLoggedIn, function (req, res){
			console.log( "Post editprofile");
			console.log(req.body.username);
			//console.log(req.files.file.path)
			user : req.user
			//if(req.busboy){
				/*console.log('Nothingg happend');
				//console.log(req.busboy);
				var fstream;
				//var busboy = new Busboy({headers: "Mhai eiei"});
				req.pipe(req.busboy);
				req.busboy.on('file', function (fieldname, file, filename) {
					console.log("Uploading: " + filename); 
					fstream = fs.createWriteStream(path.resolve('uploads/image_'+req.user._id+'.jpg'));
					console.log(fstream);
					file.pipe(fstream);
					fstream.on('close', function(err) {
						if (err){ console.log("Error Can't upload");}
						console.log("Upload completed!");
						res.redirect('/profile_inf');
					});
				});*/
			//}
			
		/*var tempPath = req.files.file.path,
			targetPath = path.resolve('uploads/'+req.files.file.originalFilename);
		var fstream;
		console.log(tempPath);
		if (path.extname(req.files.file.name).toLowerCase() === '.png') {
			fs.rename(tempPath, 'uploads/image_'+req.user._id, function(err) {
					if (err){ console.log("Error Can't upload");}
				else{console.log("Upload completed!");}
			});
		}*/
		User.updateOne({ 'local.username' : "admin" }, 
			{ $set: { "local.salary": "10,000" } },
				      function(err, results) {
				      	if(err){
				      		console.log("err")
				      	}
				      	else{
				      		 console.log(results);
					        //callback();
					        res.redirect('/profile_inf');				  
					   }
				       
				   });
					/*if (err){ 
						console.log("Upload Failed!");
						return done(err);}
					
					if (user){
							console.log(req.body.email);
							console.log(req.body.nameuser);
							console.log(user);
							console.log("eiei");
							user.updateUser(req, res)

							
					}

			});*/
			
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
		/*User.findOne({ 'local.email' : req.body.email }, function(err, user) {
				if (err){ 
					console.log("Upload Failed!");
					return done(err);}
				
				if (user){
						console.log(req.body.level);
						console.log(req.body.degree);
						console.log(user);
						console.log("eiei");
						user.addEducation(req, res)
						
				}

		});*/
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

    app.get('/userset',isLoggedIn,function(req,res){
    	console.log('Admin Get user setting');
    	return User.find( function( err, users ) {
        if( !err ) {
			console.log(users);
            res.render('admin/faculty/userlist.hbs',{
	    		layout : "adminPage",
	    		user: req.user,
	    		alluser: users
    		});
        } else {
            return console.log( err+"mhaieiei" );
	        }
	    });
    	
    });

     app.get('/adduser',isLoggedIn,function(req,res){
		console.log("Admin Get add user setting");
		res.render('admin/faculty/adduser.hbs', {
			layout: "adminPage",
            user : req.user // get the user out of session and pass to template			
        });
	});

    app.post('/adduser',isLoggedIn,function(req,res){
    	console.log('Admin Post add user setting');
	    var document = {name:"David", title:"About MongoDB"};
	    var lenn = req.body.username.length;
	    
	    var array = [];
	    var records = [ { body: 'Test 1'}, { body: "Test 2" } ];
	    for(var i=0;i<lenn;i++){
	    	if(req.body.role[i] == 'student'){
	    		var obj = { 'local': {
	    		'username':req.body.username[i],
	    		'password': req.body.username[i],
	    		'name': req.body.name[i],
	    		'role': req.body.role[i],
	    		'status': 'Normal'

	    		 }
	    		}
	    	}
	    	else{
	    		var obj = {'local' :{
	    			'username' : req.body.username[i],
	    			'password' : req.body.username[i],
	    			'name' : req.body.name[i],
	    			'role' : req.body.role[i],
	    			'salary' : 0,
	    			'academic_position': 'None', 
	    			'admin_position': 'None'

	    		}
	    	}
	    		
	    	}
	    	
	    	array.push(obj);
	    }
	   
	    
	    console.log(obj);
	    console.log(records);
	    console.log(array);

	    var arraytest = {"nameofwork":"thesis2","detail":"thesis year"};
		//use JSON.stringify to convert it to json string
        var jsonstring = JSON.stringify(arraytest);
        //convert json string to json object using JSON.parse function
        var jsonobject = JSON.parse(jsonstring);
	    var usertest = {
            'email': "aaa",
            'name': "bbb",
            'password': "ccc",
            'Role': 'lecterer'};
        async.eachSeries(array,function(item,callback) {
        	
	        User.find( { 'local.name' :  item.username }, function (err, rows) {
	        	if(err){
	        		console.log("err");
	        	}
	        	if(rows != ""){
	        		console.log("This user have already");
	        		console.log(rows);
	        		console.log(item);
	        		callback(err);
	        	}
	        	else{
        		//if there is no user with that email
           	    // create the user
                var newUser        = new User(item);

                // save the user
                newUser.save(function(err,user) {
                    if (err){console.log('mhaiiiiiii');}
                    else console.log("Insert already"+user);
                });
	        		console.log("mhai_eiei");
	            	console.log(item.username);
	            	console.log(item.type);
	            	callback(err);
	        	}
	        	
	        });
	    },function(err) {
	        if (err) throw err;
	        console.log("done");
	    });
	  //   	User.findOne({ 'local.name' :  'nmasdp' }, function(err, user) {
            
   //          if (err){
			// 	console.log("Error ...1");
			// }
   //          // check to see if theres already a user with that email
   //          if (user) {
   //          	console.log(user);
			// 	console.log("That code is already have");
   //          } else {
   //          	// if there is no user with that email
   //              // create the user
   //              var newUser        = new User(item);

   //              // save the user
   //              newUser.save(function(err,user) {
   //                  if (err){console.log('mhaiiiiiii');}
   //                  else console.log("Insert already"+user);
   //              });
   //          }
   //      });

   //      },function(err) {
	  //       if (err) throw err;
	  //       console.log("done");
	  //   });
	   
 		res.redirect('/userset');    
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
			// res.render('admin/faculty/searchprogram.hbs',{
			// 	layout: "adminMain",
			// 	user: req.user,
			// 	program : req.body.sub_programs,
			// 	acid : ac.id,
			// 	year : req.body.years
				
			// 	});
			// });
        } else {
           console.log("There not have table to show,make new");
           var acYear        = new Acyear();

            // set the user's local credentials
			acYear.academic_year = req.body.years;
			acYear.program_name = req.body.sub_programs;
			
            // save the acyear
            acYear.save(function(err,acc) {
            	if (err){console.log('mhaiiiiiii');}
                else{
                 nametemp = acc.id;
                 console.log("Insert already"+ nametemp); 
                  res.redirect('/showprogram?id'+ac.id);               	
                }
            });
       	  
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
            	acid : req.query.id,
           
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
	// return Fac.findOne({
	//      $and: [
	//             { 'program_name' : req.body.programs },
	//             { 'academic_year' : req.body.years }
	//           ]
	//    }, function( err, programs ) {
	//     if( !err ) {
	//     	console.log(programs);
	// 		console.log( "What happend here" );
	//         res.render('faculty/showprogram.ejs', {
	// 		  user : req.user,
	//           program: programs
	//         });
	//     } else {
	//     	//res.redirect('/fachome');
	//         return console.log( err+"mhaieiei" );
	//         }
	//     });
	//  });

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
		// Fac.findOne({ 'fac_name' :  "International College" }, function(err, ac) {
        
  //       if (err){
		// 	console.log("Error ...1");
		// }
  //       // check to see if theres already a user with that email
  //       if (ac) {
		// 	console.log("That code is already have");
			
			
  //       } else {
  //           // if there is no user with that email
  //           // create the user
  //           var newFac        = new Fac();

  //           // set the user's local credentials
		// 	newFac.fac_name = "International College" ;
			
  //           // save the acyear
  //           newFac.save(function(err,fac) {
  //           	if (err){console.log('mhaiiiiiii');}
  //               else{
  //                console.log("Insert already"+ fac);
                 	
  //               }
  //           });
  //      	 }
		// });
		
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
		console.log(req.query.acid);
		console.log(yearlevel);
		res.render("admin/faculty/addsubprogram.hbs",{
			layout : "adminMain",
			user : req.user,
			acid : req.query.acid,
			yearlevel : yearlevel
		});
	});
		
		
		// return Fac.find( function( err, faculty ) {
  //       if( !err ) {
		// 	console.log(faculty);
  //           res.render("admin/faculty/addsubprogram.hbs", {
  //           	layout: "adminMain",
  //           	user : req.user,
  //           	faculty: faculty,
  //           	year : years,
  //           	cryear : current_year,
  //           	helpers: {
  //           	set: function (value) { index = value; },
  //           	get: function(){return index;}
  //           	}
  //           });
  //       } else {
  //           return console.log( err+"mhaieiei" );
	 //        }
	 //    })



	app.post('/addsubprogram',isLoggedIn,function(req,res){
		console.log("Posttt Add Program");
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

		/*Fac.update({ 'fac_name' : "International College" },
		{
		 "$push" : {
			"program" :  {
					 "sub_program" : req.body.sub_program,
					 "program_name": req.body.program_name,
					 "program_year": req.body.program_years,
					 "academic_year": current_year,
					 "subject": req.body.subject_code
				   } //inserted data is the object to be inserted 
			  }
			},{safe:true},
			  function (err, program) {
				if (err){console.log('mhaiiiiiii');}
			    else console.log(program);
		});*/
		res.redirect('/showprogram?id='+req.body.acid);
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

		// Subject.update({ 'sub_code' : req.query.id },
		// {
		//  "$unset" : {"sub_code": req.query.id},				  
		// 	},{safe:true},
		// 	  function (err, user) {
		// 		if (err){console.log('mhaiiiiiii');}
		// 	    else console.log(user);
		// });
		// res.redirect('/subjects');
		
		
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
		//simple json record
		//var document = {idUser: req.query.id};
		//console.log(req.body.name);
		//console.log(document);
		//insert record
		/*Fac.findOne({ 'program_name' :  req.body.name }, function(err, fac) {
            // if there are any errors, return the error
            if (err){
				console.log("Error ...1");
			}
            // check to see if theres already a user with that email
            if (fac) {
				console.log("That fac is already have");
            } else {
                // if there is no user with that email
                // create the user
                var newFac  = new Fac();
                // set the user's local credentials
				newFac.program_name = req.body.name;
				newFac.program_year = req.body.year;
               	newFac.subject = array;	
                // save the user
                newFac.save(function(err,user) {
                    if (err){console.log('mhaiiiiiii');}
                    else console.log("Insert already"+user);
                });
            }

        });  */
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
		//test = JSON.parse(array);
		//console.log(test);
		/*PSchema.find({},function(err,docs){
			docs.forEach(function(doc){
			if(doc.array.indexOf("hello2") == -1)
			{
			    doc.array.push("hello2");
			    doc.save(function (err) {
			        if(err) {
			            //error
			        }
			    });
			}
			})
			})*/
		/*Work.findOne({'nameUser' : req.query.email },function(err,docs){
				console.log(docs);
			    docs.push(test);
			    docs.save(function (err,user) {
			        if (err){console.log('mhaiiiiiii'+err);}
			    	else console.log(user);
			    });
			
			});

			"details": req.body.details*/
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
	//app.get('/workflow', function(req, res){
	//	res.render('wf/index.hbs',{
	//		layout:"workflowMain"
	//	});
	//});

	app.get('/workflow', function(req, res){
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

	//=====================================
	// DMs. ==============================
	// =====================================




	app.post('/getdoc',function(req,res){
		console.log('Post Document');
		var doc_name = req.body.doc_name;
		var doc_author = req.body.doc_author;
		var doc_status = req.body.doc_status;
		console.log(JSON.stringify(req.body));
		// console.log("test date ",req.body['fromDate']);
		console.log("test status ",req.body['doc_status']);
		console.log("test get date",req.body['toDate']);
		console.log('req.body.doc_name', req.body['doc_name']);
		res.render('dms/getdoc.hbs',{
				layout: "homePage"
			});
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

