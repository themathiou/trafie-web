var User = require('../models/user.js');

exports.get = function( req, res ) {
  if( typeof req.session.user_id !== 'undefined' ) {
    res.json( null );
  }

  // Else, fetch the first name and the last name of the user from the database
  Profile.schema.findOne({ '_id': user_id }, 'first_name')
  .then( function( response ) {
    if( response.first_name ) {
      var data = {
        'first_name': response.first_name
      }

      res.json( data );
    }
};

exports.get_view = function( req, res ) {
  if( typeof req.session.user_id !== 'undefined' ) {
    res.send('');
  }

  res.render('layout');
};