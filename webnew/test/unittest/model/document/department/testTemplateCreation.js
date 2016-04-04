var expect = require('chai').expect;

var template = require('model/document/department/template');

module.exports = function() {
	it('should set correct subtype on a correct field', function() {
		var type = 'XX';
		var Doc = template(type);

		var xx = new Doc();
		expect(xx.department).to.exist;
		expect(xx.department).to.equals(type);
	});

	it("should return the same schema if additional key-value pairs don't add", function() {
		throw "Not implemented";
	});

	describe('Parameterize test on template parameters', function() {

	});
}