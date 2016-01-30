// =====================================
// Setting Up Workflow ========
// =====================================
var parseString 		= require('xml2js').parseString;
var WorkflowHandler		= require('./WorkflowHandler');
var years = [2012,2013,2014,2015,2016];
var yearlevel = [1,2,3,4];

var date = new Date();
var current_year = date.getFullYear();
var index = 0;
var nametemp = "";

module.exports = function(app) {
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

}