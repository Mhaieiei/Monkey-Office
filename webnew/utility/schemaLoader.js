module.exports = function(database) {

	database.model('User', require('../model/user'));
	database.model('Work', require('../model/works'));
	database.model('Document', require('../model/document'));

	database.model('Faculty', require('../model/faculty'));
	database.model('Subject', require('../model/subject'));
	database.model('AcademicYear', require('../model/academic_year'));
	database.model('TeachingSemester', require('../model/teaching_semester'));
	database.model('TemplateWorkflow', require('../model/TemplateWorkflow'));
	database.model('Document', require('../model/document'));

	var models = {
		User: database.model('User'),
		Work: database.model('Work'),
		Document: database.model('Document'),
		Faculty: database.model('Faculty'),
		Subject: database.model('Subject'),
		AcademicYear: database.model('AcademicYear'),
		TeachingSemester: database.model('TeachingSemester'),
		TemplateWorkflow: database.model('TemplateWorkflow'),
	}

	return models;
}






