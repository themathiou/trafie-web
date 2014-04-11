var User = require('../models/user.js');

exports.get = function( req, res ) {
  res.render('login', { 'errors': {} } );
};

exports.post = function( req, res ) {
  var email = req.body.email;
  var password = User.schema.encryptPassword(req.body.password);

  // Find user by id and password
  User.schema.findOne({ 'email': email, 'password': password, }, '_id valid')
  .then(function(response) {

    // If the user was found
    if( response !== null && typeof response._id !== 'undefined' ) {
      // If the user has validated their account
      if( response.valid === true ) {
        // Start the session and log the user in
      	req.session.user_id = response._id;
  	    res.redirect('/');
      } else {
        // If the user is not valid yet, notify them that there is an email waiting
        res.redirect('/validation_email_sent/1/' + response._id );
      }
    } else {
      // If the user wasn't found, show the error
	    res.render('login', { 'errors': { 'email': 'Email - password combination wasn\'t found' } } );
    }
  })
	.fail(function(response) {
		console.log("Error : " + response);
  });

};