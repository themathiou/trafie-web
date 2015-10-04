//var activityController = require('../../routes/activities.js');
var request = require('request');
//var cookie = request.cookie("user_id=538e07387e263e4e19000001");
var request = request.defaults({jar: true});

describe("/user/:user_id/activites", function () {

	it("should return an object", function ( done ) {
		request.post('http://localhost:3000/login', 
			{form:{email:'user@trafie.com', password:'123123'}},
			function(error, response, body) {
				request.get("http://localhost:3000/user/538e07387e263e4e19000001/activities",
				function(error, response, body){
					expect(body).toEqual(jasmine.any(Array));
					done();
				});
			}
		);

	});

}); 