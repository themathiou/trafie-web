'use strict';

const Profile = require('../models/profile.js'),
    Activity = require('../models/activity.js');
// Initialize translations
const translations = require('../languages/translations.js');

exports.get_view = function( req, res ) {
  if( typeof req.session.user_id === 'undefined' && !req.params.profile_id ) {
    res.redirect('/register');
    return false;
  }

  var user_id = req.session.user_id ? req.session.user_id : req.params.profile_id;
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
    } else {
      res.sendfile('./app/views/four_oh_four.html');
    }
  });

};