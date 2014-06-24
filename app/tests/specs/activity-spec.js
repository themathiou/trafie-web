var activityController = require('../../routes/activities.js');
var request = require('request');
var cookie = request.cookie("user_id=538e07387e263e4e19000001");
var jar = request.jar();
jar.add(cookie);

describe("/user/:user_id/activites", function () {

/*	// Mock request object
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
	};

	// Mock response object
	var res = {
		json: function( json ) {
			return json;
		}
	};*/

	/*beforeEach(function() {
			spyOn(activityController.get, 'return_activities');
	});*/

/*	it("should return an object", function ( done ) {
		var response = activityController.get( req, res );

		expect(response).toEqual(jasmine.any(Object));

	});*/

	it("should return an object", function ( done ) {
		//var response = activityController.get( req, res );
		request({
						  uri: "http://localhost:3000/user/538e07387e263e4e19000001/activities",
							method: "GET",
							jar: jar
						},
						function(error, response, body){
			expect(body).toEqual(jasmine.any(Object));
			done();
		});

	});

}); 