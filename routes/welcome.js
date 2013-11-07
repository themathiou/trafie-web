var welcome = function(req, res){
	// GET request of the Welcome Page
	if(req.method == 'GET') {
		res.render('welcome', { title: 'Express' });

	// POST request of the Welcome Page
	} else {
		var welcome_model = require('./../models/welcome');

		console.log("Email: " + req.body.email + " - Password: " + req.body.password);
		var this_email = req.body.email;
		var this_password = req.body.password;

		var new_user = new welcome_model.Users({ email: this_email, password:this_password });
		res.render('welcome', { title: 'Express' });
	}
};

module.exports = welcome;