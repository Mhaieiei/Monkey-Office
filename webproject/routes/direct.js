module.exports = function(app, passport) {

	require('../controllers/common/home')(app);

	require('../controllers/authentication/auth')(app, passport);
    require('../controllers/authentication/signup')(app, passport);

    require('../controllers/user/profile')(app);
    require('../controllers/user/admin')(app);
	
	require('../controllers/quality_assurance/qa')(app);
	require('../controllers/workflow/workflow')(app);
};
