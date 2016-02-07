var auth = require('../../middlewares/auth');

module.exports = function(app) {
		 // =====================================
    // Admin SECTION =====================
    // =====================================
    app.get('/admin',auth.isLoggedIn,function(req,res){
		console.log("Get Admin");
		console.log(current_year);
		res.render('admin/home.hbs', {
			layout: "adminMain",
            user : req.user // get the user out of session and pass to template			
        });
	});
	app.get('/programs',auth.isLoggedIn,function(req,res){
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
	app.post('/programs',auth.isLoggedIn,function(req,res){
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
    
    app.get('/showprogram',auth.isLoggedIn,function(req,res){
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

	app.post('/showprogram',auth.isLoggedIn,function(req,res){
	console.log("Post show program");
	console.log(req.body.sub_programs);
	console.log(req.body.years);
	console.log(req.query.acid);	

		
 	});

	app.get('/addprogram',auth.isLoggedIn,function(req,res){
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

	app.get('/addsubprogram',auth.isLoggedIn,function(req,res){
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

	app.post('/addsubprogram',auth.isLoggedIn,function(req,res){
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

	
	app.get('/subjects',auth.isLoggedIn,function(req,res){
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
	app.get('/addsubjects',auth.isLoggedIn,function(req,res){
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
	app.post('/addsubjects',auth.isLoggedIn,function(req,res){
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
	app.get('/delsub',auth.isLoggedIn,function(req,res){
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
	app.get('/editsubject',auth.isLoggedIn,function(req,res){
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
	
	app.post('/editsubjects',auth.isLoggedIn,function(req,res){
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
}