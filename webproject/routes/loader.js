module.exports = function(app, passport) {

	var routePages = [
		'./common/home',

		'./authentication/auth',
		'./authentication/signup',

		'./user/profile',
		'./user/admin',

		'./quality_assurance/qa',
		'./workflow/workflow'		
	];

	routePages.forEach(function (page) {
		require(page)(app, passport);
	});
};
