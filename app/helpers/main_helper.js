'use strict';

// Loading models
const Profile = require('../models/profile.js');

var mainHelper = {};

/**
 * Checks if the user has access to the requested data
 * @param  String	  user_id
 * @param  String     profile_id
 * @param  Function   callback
 */
mainHelper.validateAccess = function ( user_id, profile_id, callback ) {
	var response = {
		success: false,
		user: {},
		profile: {},
		error: ''
	},
	user_data = false;

	if( user_id ) {
		Profile.schema.findOne({ '_id': user_id }, '_id language date_format').then( function( user_data_response ) {

			// If the user wasn't found, there's no point to continue
			if( !user_data_response ) {
				response.error = 'user_not_valid';
				callback( response );
			}

			response.user = user_data_response;
			user_data = user_data_response;

			// If the user didn't request profile specific data (E.g. he requested settings)
			if( typeof profile_id === 'undefined' ) {
				// Just return the user
				response.success = true;
				callback( response );
			} else {
				accessProfile();
			}
		})
		.fail( function( error ) {
			response.error = 'query_error';
			callback( response );
		});
	} else {
		// A user who is not logged in tries to access a profile
		response.user = {
			language: 		'en',
			date_format: 	'd-m-y'
		};
		accessProfile();
	}

	function accessProfile() {
		// If there is no profile id, return an error
		if( typeof profile_id === 'undefined' || !profile_id ) {
			// Just return the user
			response.error = 'profile_not_valid';
			callback( response );
			return;
		}

		// Find the profile by id
		Profile.schema.findOne( { '_id': profile_id }, '_id first_name last_name discipline country male picture username private')
		.then( function( profile_data ) {
			// If the profile was found, get the data of the user
			if( profile_data !== null && profile_data !== undefined ) {
				// Check if the profile found is private
				handlePrivacy( profile_data );
				return 0;
			} else {
				// If the profile wasn't found, try to find it by username
				return Profile.schema.findOne( { 'username': profile_id }, '_id first_name last_name discipline country male picture username private');
			}
		})
		.then( function( profile_data ) {
			if( profile_data !== 0 ) {
				// If the profile was found, get the data of the user
				if( profile_data !== null && profile_data !== undefined ) {
					// Check if the profile found is private
					handlePrivacy( profile_data );
				} else {
					// If the profile wasn't found
					response.error = 'profile_not_valid';
					callback( response );
					return;
				}
			}
		})
		.fail( function( error ) {
			response.error = 'query_error';
			callback( response );
		});
	}

	function handlePrivacy( profile_data ) {
		// If the profile requested is a private profile and the user who tries to access it
		// is not the user who owns it
		if( profile_data.private && ( !user_data || profile_data._id.toString() !== user_data._id.toString() ) ) {
			// Deny access
			response.error = 'profile_not_valid';
			callback( response );
		} else {
			// Return the profile data along with the data of the user who requested it
			response.profile = profile_data;
			response.success = true;
			callback( response );
		}
	}
};

module.exports = mainHelper;