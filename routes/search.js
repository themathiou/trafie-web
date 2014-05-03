var Profile = require('../models/profile.js');

// Initialize translations
var translations = require('../languages/translations.js');

exports.get = function( req, res ) {
	if( typeof req.session.user_id === 'undefined' || typeof req.query.value === 'undefined' ) {
		res.redirect('/');
	}
	
	// Find the profile
	Profile.schema.findOne({ '_id': req.session.user_id }, 'language date_format')
	.then( function( profile_data ) {
		var requested_values = req.query.value.split(' ');
		
		var query = { $or: [] };

		var requested_values_length = requested_values.length;
		var ands = [];
		
		for( var i=0 ; i<requested_values_length ; i++ ) {
			for( var j=0; j<requested_values_length ; j++ ) {
				if( i !== j ) {
					ands.push( { $and: [{ 'first_name': requested_values[i] }, { 'last_name': requested_values[j] }] } );
				}
			}
			ands.push({ 'first_name': requested_values[i] });
			ands.push({ 'last_name': requested_values[i] });			
		}

		var query = { $or: ands };
		return Profile.schema.find( query, 'first_name last_name discipline country')
	})
	.then( function( results ){
		res.json( results );
	})
	.fail( function( error ) {
		send_error_page( error, res );
	});
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