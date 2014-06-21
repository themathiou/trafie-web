var activityController = require('../../routes/activities.js');
 
describe("/user/:user_id/activites", function () {
	var req = {
		session: {
			user_id: '538e07387e263e4e19000001'
		},
		params: {
			user_id: '538e07387e263e4e19000001'
		},
		query: {
			discipline: '',
			from: 			'',
			to: 				''
		}
	}

	var res = {
		json: function( json ) {
			return json;
		}
	}

/*	beforeEach(function() {
		performance
	});*/

	it("should return an object", function () {
		var response = activityController.get( req, res );
			expect(response).toEqual(jasmine.any(Object));
	 });
}); 