module.exports = function(database) {

	var models = {};

	models.User             = database.model('User', require('../model/user'));
<<<<<<< HEAD

	models.Work             = database.model('Work', require('../model/works').Work,'works');
	models.Work.Project     = database.model('Project', require('../model/works').Project,'works');

	models.Document         = database.model('Document', require('../model/document'));
	models.Faculty          = database.model('Faculty', require('../model/faculty'));
	models.Subject          = database.model('Subject', require('../model/subject'));
	models.AcademicYear     = database.model('Acyear', require('../model/academic_year'));
	models.TeachingSemester = database.model('Yearstudy', require('../model/teaching_semester'));
=======
	models.Work             = database.model('Work', require('../model/works'));
	models.Document         = database.model('Document', require('../model/document'));
	models.Faculty          = database.model('Faculty', require('../model/faculty'));
	models.Subject          = database.model('Subject', require('../model/subject'));
	models.AcademicYear     = database.model('AcademicYear', require('../model/academic_year'));
	models.TeachingSemester = database.model('TeachingSemester', require('../model/teaching_semester'));
>>>>>>> parent of e5f5e9e... [refactor] compile schemas in the file itself and include them just like what we did with mongoose
	models.TemplateWorkflow = database.model('TemplateWorkflow', require('../model/TemplateWorkflow'));
	models.StudentEnroll    = database.model('Stdenroll', require('../model/student_enroll'));
	models.SubjectEnroll    = database.model('Subenroll', require('../model/subject_enroll'));

	return models;
}






