var Profile = require('../models/profile.js'),
    Activity = require('../models/activity.js');

// Initialize translations
var translations = require('../languages/translations.js');


/**
 * Profile - GET
 */
exports.get = function( req, res ){
  var user_id = req.session.user_id;

  // When there is a username in the url
  if( typeof req.params.user_id !== 'undefined' ) {
    console.log( req.params.user_id );
  }

  if(!user_id) {
    res.redirect('/register');
  } else {
    Profile.schema.findOne( { '_id': user_id }, 'first_name last_name discipline country male birthday picture language date_format' ).then( function( profile_data ) {
      // If the user was found
      if( typeof profile_data.first_name !== 'undefined' ) {
        render( res, user_id, profile_data );
      // If the user wasn't found
      } else {
        res.redirect('/login');
      }
    });
  }
};

function render( res, user_id, profile_data ) {
  Activity.schema.getActivitiesOfUser( { 'user_id': user_id }, null, -1 )
  .then( function( activities ) {

    // The data that will go to the front end
    var view_data = {
      'profile': {
        '_id'         : user_id,
        'first_name'  : profile_data.first_name,
        'discipline'  : profile_data.discipline
      },
      'tr'          : translations[profile_data.language]
    };

    res.render( 'statistics', view_data );
  });
}