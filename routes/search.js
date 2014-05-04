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
		var requested_value_string = req.query.value.trim();
		var requested_values = requested_value_string.split(' ');
		
		var query = { $or: [] };

		var requested_values_length = requested_values.length;
		var ands = [];

		if( requested_value_string && requested_values_length == 1 ) {
			ands.push({ 'first_name': { $regex: new RegExp("^" + requested_values[0].toLowerCase() + ".*", "i") } });
			ands.push({ 'last_name': { $regex: new RegExp("^" + requested_values[0].toLowerCase() + ".*", "i") } });			
		} 
		else if( requested_value_string ){
			for( var i=0 ; i<requested_values_length ; i++ ) {
				for( var j=0; j<requested_values_length ; j++ ) {
					if( i > j ) {
						ands.push( { $and: [{ 'first_name': { $regex: new RegExp("^" + requested_values[i].toLowerCase() + ".*", "i") } }, { 'last_name': { $regex: new RegExp("^" + requested_values[j].toLowerCase() , "i") } }] } );
					}
					else if( i < j ) {
						ands.push( { $and: [{ 'first_name': { $regex: new RegExp("^" + requested_values[i].toLowerCase(), "i") } }, { 'last_name': { $regex: new RegExp("^" + requested_values[j].toLowerCase() + ".*", "i") } }] } );	
					}
				}
			}
		}
		

		var query = { $or: ands };
		return Profile.schema.find( query, 'first_name last_name discipline country username _id')
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