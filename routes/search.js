var Profile = require('../models/profile.js');

// Initialize translations
var translations = require('../languages/translations.js');

exports.get = function( req, res ) {
	if( typeof req.session.user_id === 'undefined' || typeof req.query.value === 'undefined' ) {
		res.redirect('/');
	}
	
	var language;
	// Find the profile
	Profile.schema.findOne({ '_id': req.session.user_id }, 'language date_format')
	.then( function( profile_data ) {
		var requested_value_string = req.query.value.trim();
		var requested_values = requested_value_string.split(' ');
		var requested_values_length = requested_values.length;
		language = profile_data.language;

		if( !requested_value_string ) {
			res.json( [] );
		}

		var ands = [];

		for( var i=0; i<requested_values_length ; i++ ) {
			requested_values[i] = requested_values[i].toLowerCase();
			if( i == requested_values_length-1 ) {
				ands.push( { 'keywords.names': { $regex: new RegExp("^" + requested_values[i] + ".*") } } );
			}
			else {
				ands.push( { 'keywords.names': requested_values[i] } );
			}
		}

		var query = { $and: ands };

		return Profile.schema.find( query, 'first_name last_name discipline country username _id', 10 );
	})
	.then( function( results ){
		var results_length = results.length;
		var formatted_results = [];
		for ( var i=0 ; i<results_length ; i++ ) {
			formatted_results[i] = {};
			formatted_results[i]._id = results[i]._id;
			formatted_results[i].first_name = results[i].first_name;
			formatted_results[i].last_name = results[i].last_name;
			formatted_results[i].discipline = results[i].discipline;
			formatted_results[i].country = results[i].country;
			formatted_results[i].username = results[i].username;
			formatted_results[i].formatted_country = results[i].country ? translations[language][results[i].country] : '';
			formatted_results[i].formatted_discipline = results[i].discipline ? translations[language][results[i].discipline] : '';
		}

		res.json( formatted_results );
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