var crypto = require('crypto');

var mainHelper = {};


/**
* Encrypt password using sha512_hash
* @param String password
*/
mainHelper.validateAccess = function ( user_id, profile_id ) {
	var response = {
		success: false,
		user: {},
		profile: {},
		error: ''
	};
	
	Profile.schema.findOne({ '_id': user_id }, '_id language date_format').then( function( user_data ) {

		if( !user_data ) {
			response.error = 'user_not_valid';
			return response;
		}

		response.user = user_data;

		if( typeof profile_id === 'undefined' ) {
			response.success = true;
			return response;
		} else {
			// Find the profile by id
			Profile.schema.findOne({ $or: ['_id': req.params.profile_id, 'username': req.params.profile_id] }, '_id first_name last_name discipline country male picture private')
			.then( function( profile_data ) {
				// If the profile was found, get the data of the user
				if( profile_data !== null && profile_data !== undefined ) {
					
				} else {
					
				}
			})
			.fail( function( error ) {
				response.error = 'query_error';
				return response;
			});
		}
	})
	.fail( function( error ) {
		response.error = 'query_error';
		return response;
	});
};

module.exports = mainHelper;