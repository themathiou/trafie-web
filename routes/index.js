var Profile = require('../models/profile.js');
// Initialize translations
var translations = require('../languages/translations.js');


exports.get = function( req, res ) {
  if( typeof req.session.user_id === 'undefined' ) {
    res.json( null );
    return false;
  }

  var user_id = req.session.user_id;

  // Else, fetch the first name and the last name of the user from the database
  Profile.schema.findOne({ '_id': user_id }, '_id first_name')
  .then( function( response ) {
    if( response.first_name ) {
      var data = {
        'user': {
          '_id'       : response._id,
          'first_name': response.first_name
        }
      }

      res.json( data );
    }
  });
};

exports.get_view = function( req, res ) {
  if( typeof req.session.user_id === 'undefined' ) {
    res.json( null );
    return false;
  }

  var user_id = req.session.user_id;
  Profile.schema.findOne({ '_id': user_id }, '_id first_name language')
  .then( function( response ) {
    if( response.first_name ) {
      var data = {
        'user': {
          '_id'       : response._id,
          'first_name': response.first_name
        },
        'tr'        : translations[response.language]
      }

      res.render('layout', data);
    }
  });

};