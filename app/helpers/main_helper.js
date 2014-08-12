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
	};
	
	if( user_id ) {
		Profile.schema.findOne({ '_id': user_id }, '_id language date_format').then( function( user_data ) {

			// If the user wasn't found, there's no point to continue
			if( !user_data ) {
				response.error = 'user_not_valid';
				callback( response );
			}

			response.user = user_data;

			// If the user didn't request profile specific data (E.g. he requested settings)
			if( typeof profile_id === 'undefined' ) {
				// Just return the user
				response.success = true;
				callback( response );
			} else {
				access_profile();
			}
		})
		.fail( function( error ) {
			response.error = 'query_error';
			callback( response );
		});
	} else {
		response.user = {
			language: 		'en',
			date_format: 	'd-m-y'
		};
		access_profile();
	}

	function access_profile() {
		// If there is no profile id, return an error
		if( typeof profile_id === 'undefined' ) {
			// Just return the user
			response.error = 'profile_not_valid';
			callback( response );
		}

		// Find the profile by id
		Profile.schema.findOne( { $or: [ {'_id': profile_id}, {'username': profile_id } ] }, '_id first_name last_name discipline country male picture private')
		.then( function( profile_data ) {
			// If the profile was found, get the data of the user
			if( profile_data !== null && profile_data !== undefined ) {
				// If the profile requested is a private profile and the user who tries to access it
				// is not the user who owns it
				if( profile_data.private && ( typeof user_data === 'undefined' || profile_data._id !== user_data._id ) ) {
					// Deny access
					response.error = 'profile_not_valid';
					callback( response );
				} else {
					// Return the profile data along with the data of the user who requested it
					response.profile = profile_data;
					response.success = true;
					callback( response );
				}
			} else {
				// If the profile wasn't found
				response.error = 'profile_not_valid';
				callback( response );
			}
		})
		.fail( function( error ) {
			response.error = 'query_error';
			callback( response );
		});
	}
};

module.exports = mainHelper;