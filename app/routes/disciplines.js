'use strict';

// Loading models
var Profile = require('../models/profile.js'),
	Activity = require('../models/activity.js');

// Initialize translations
var translations = require('../languages/translations.js');

/**
 * Activities - GET
 */
exports.get = function( req, res ){
	var user_id = req.session.user_id;

	if( user_id ) {
		var user_data;
		// Else, fetch the first name and the last name of the user from the database
		Profile.schema.findOne({ '_id': user_id }, 'language')
		.then( function( response ) {
			user_data = response;
			return Activity.schema.getDisciplinesPerformedByUser( { 'user_id': user_id } );
		})
		.then( function( disciplines ) {
			var response = [];
			var disciplines_length = disciplines.length;
			var tr = translations[user_data.language];

			for( var i=0 ; i<disciplines_length ; i++ ) {
				response[i] = {
					'discipline': 			disciplines[i],
					'formatted_discipline': tr[disciplines[i]]
				};
			}
			
			res.json( response );
		})
		.fail( function( error ) {
			send_error_page( error, res );
		});
	} else {
		res.json( null );
	}
};

/**
 * Sends an error page in case a query fails
 * @param string error
 * @param object res
 */
function send_error_page( error, res ) {
	res.statusCode = 500;
	res.json( null );
}