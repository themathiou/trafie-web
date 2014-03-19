var User = require('../models/user.js');

exports.get = function( req, res ) {
  res.render('login', { 'errors': {} } );
};

exports.post = function( req, res ) {
  var email = req.body.email;
  var password = User.schema.encryptPassword(req.body.password);

  User.schema.findOne({ 'email': email, 'password': password, }, '_id valid')
  .then(function(response) {
    if( response !== null && typeof response._id !== 'undefined' ) {
      if( response.valid === true ) {
      	req.session.user_id = response._id;
  	    res.redirect('/');
      } else {
        res.redirect('/validation_email_sent/1/' + response._id );
      }
    } else {
	    res.render('login', { 'errors': { 'email': 'Email - password combination wasn\'t found' } } );
    }
  })
	.fail(function(response) {
		console.log("Error : " + response);
  });

};