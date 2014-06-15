var Profile = require('../models/profile.js'),
    Activity = require('../models/activity.js');
// Initialize translations
var translations = require('../languages/translations.js');


exports.get = function( req, res ) {
  if( typeof req.session.user_id === 'undefined' ) {
    res.json( null );
    return false;
  }

  var user_id = req.session.user_id;
  var user_data;

  // Else, fetch the first name and the last name of the user from the database
  Profile.schema.findOne({ '_id': user_id }, '_id first_name discipline language date_format')
  .then( function( response ) {
    user_data = response;
    return Activity.schema.getDisciplinesPerformedByUser( { 'user_id': user_id } );
  })
  .then( function( disciplines_of_user_raw ) {
    if( user_data.first_name ) {

      var tr = translations[user_data.language];
      var disciplines_of_user = {};
      for( var i in disciplines_of_user_raw ) {
        disciplines_of_user[disciplines_of_user_raw[i]] = tr[disciplines_of_user_raw[i]];
      }

      var data = {
        'user': {
          '_id':                  user_data._id,
          'first_name':           user_data.first_name,
          'discipline':           user_data.discipline,
          'formatted_discipline': tr[user_data.discipline],
          'disciplines_of_user':  disciplines_of_user
        }
      };

      res.json( data );
    } else {
      res.json( null );
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