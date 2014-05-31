var fs = require('fs'),
		path = require('path'),
		root_dir = path.dirname( require.main.filename );

// Initialize translations
var translations = require('../languages/translations.js');

var User = require('../models/user.js');
var Profile = require('../models/profile.js');


exports.get = function( req, res ){
	var first_name, last_name;
	var user_id = req.session.user_id;
	var update = '';
	var error_messages = '';

	// If there is no user id in the session, redirect to register screen
	if( !user_id ) res.json( null );

	// Else, fetch the first name and the last name of the user from the database
	Profile.schema.findOne({ '_id': user_id }, 'first_name last_name discipline about male country birthday picture language date_format username')
	.then( function( response ) {
		console.log( response );
		// If the profile wasn't found, redirect
		if( typeof response.first_name === 'undefined' ) redirect('/register');

		// Format the data that will go to the front end
		var gender = '';
		if( response.male === true ) {
			gender = 'male';
		}
		else if( response.male === false ) {
			gender = 'female';
		}
		
		var birthday = {};
		birthday.day = response.birthday.day ? response.birthday.day : '';
		birthday.month = response.birthday.month ? response.birthday.month : '';
		birthday.year = response.birthday.year ? response.birthday.year : '';

		var picture = response.picture ? response.picture : ( response.male ? '/images/profile_pics/default_male.png' : '/images/profile_pics/default_female.png' );

		var data = {
			'user': {
				'_id'         : user_id,
				'first_name'  : response.first_name,
				'last_name'   : response.last_name,
				'discipline'  : response.discipline,
				'about'       : response.about,
				'country'     : response.country,
				'birthday'    : birthday,
				'picture'     : picture,
				'language'    : response.language,
				'date_format' : response.date_format,
				'username'    : response.username
			}
		};

		res.json( data );
	})
	.fail( function( error ) {
		send_error_page( error, res );
	});
};


exports.post = function( req, res ) {
	var user_id = req.session.user_id;

	// If there is no user id in the session, redirect to register screen
	if(!user_id) res.redirect('/register');

	// Check if the profile really exists
	Profile.schema.findOne({ '_id': user_id }, 'first_name')
	.then( function( response ) {
		// If the profile doesn't exist, redirect
		if( typeof response.first_name === 'undefined' ) redirect('/register');

		var error_messages = {};
		var update = '';
		var profile_data = {};
		var user_data = {};
		var errors = false;

		// Validating first name
		if( typeof req.body.first_name !== 'undefined' ) {
			profile_data.first_name = req.body.first_name;
			if( !Profile.schema.validateName( profile_data.first_name ) ) {
				error_messages.first_name = 'invalid_name';
				errors = true;
			}
		}

		// Validating last name
		if( typeof req.body.last_name !== 'undefined' ) {
			profile_data.last_name = req.body.last_name;
			if( !Profile.schema.validateName( profile_data.last_name ) ) {
				error_messages.last_name = 'invalid_name';
				errors = true;
			}
		}

		// Validating birthday
		if( typeof req.body.birthday_day !== 'undefined' && typeof req.body.birthday_month !== 'undefined' && typeof req.body.birthday_year !== 'undefined' ) {
			profile_data.birthday = {};
			profile_data.birthday.day = req.body.birthday_day;
			profile_data.birthday.month = req.body.birthday_month;
			profile_data.birthday.year = req.body.birthday_year;
			if( !Profile.schema.validateBirthday( profile_data.birthday ) ) {
				errors = true;
			}
		}

		// Validating gender
		if( typeof req.body.gender !== 'undefined' ) {
			if( !Profile.schema.validateGender( req.body.gender ) ) {
				errors = true;
			} else {
				profile_data.male = req.body.gender == 'male';
			}
		}

		// Validating country
		if( typeof req.body.country !== 'undefined' ) {
			if( !Profile.schema.validateCountry( req.body.country ) ) {
				errors = true;
			} else {
				profile_data.country = req.body.country;
			}
		}

		// Validating discipline
		if( typeof req.body.discipline !== 'undefined' ) {
			if( !Profile.schema.validateDiscipline( req.body.discipline ) ) {
				errors = true;
			} else {
				profile_data.discipline = req.body.discipline;
			}
		}

		// Validating the about me text
		if( typeof req.body.about !== 'undefined' ) {
			if( !Profile.schema.validateAbout( req.body.about ) ) {
				errors = true;
			} else {
				profile_data.about = req.body.about;
			}
		}

		// Validating language
		if( typeof req.body.language !== 'undefined' ) {
			if( !Profile.schema.validateLanguage( req.body.language ) ) {
				errors = true;
			} else {
				profile_data.language = req.body.language;
			}
		}

		// Validating date format
		if( typeof req.body.date_format !== 'undefined' ) {
			if( !Profile.schema.validateDateFormat( req.body.date_format ) ) {
				errors = true;
			} else {
				profile_data.date_format = req.body.date_format;
			}
		}

		// Validating date format
		if( typeof req.body.username !== 'undefined' ) {
			if( !Profile.schema.validateUsername( req.body.username ) ) {
				errors = true;
				error_messages.username = 'invalid_username';
				res.json( { 'success': false } );
			} else {
				var username = req.body.username.toLowerCase();
				Profile.schema.findOne({ 'username': username }, '_id')
				.then( function( response ) {
					if( response == null ) {
						profile_data.username = username;
					} 
					else {
						errors = true;
						if( response._id != user_id ) {
							error_messages.username = 'username_exists';
						}
					}

					if( errors ) {
						res.json( { 'success': false } );
					} else {
						Profile.update({ '_id': user_id }, { $set: profile_data }, { upsert: true }, function( error ) {
							res.json( { 'success': true } );
						})
						.fail( function( error ) {
							send_error_page( error, res );
						});
					}
					return response;
				});
			}
		}

		// Checking if the uploaded file is a valid image file
		else if( typeof req.files !== 'undefined' && typeof req.files.profile_pic !== 'undefined' ) {
			// Read the image file
			fs.readFile( req.files.profile_pic.path, function ( err, data ) {
				// Get the file extension
				var extension = req.files.profile_pic.name.split('.')[1];

				var accepted_file_types = ['image/jpeg', 'image/png'];
				// File size in MB
				var accepted_file_size = 5;

				// If the file size is acceptable
				if( req.files.profile_pic.size > accepted_file_size * 1048576 ) {
					errors = true;
					error_messages.profile_pic = 'uploaded_image_too_large';
				}

				// If the file type is acceptable
				if( accepted_file_types.indexOf( req.files.profile_pic.type ) < 0 ) {
					errors = true;
					error_messages.profile_pic = 'uploaded_image_wrong_type';
				}

				if( !errors ) {
					profile_data.picture = '/images/profile_pics/' + user_id + '.' + extension;

					// Save the file in the images folder
					fs.writeFile( root_dir + '/public' + profile_data.picture, data, function ( err ) {
						// Update the database
						Profile.update({ '_id': user_id }, { $set: profile_data }, { upsert: true }, function( error ) {
							res.json( { 'success': true } );
						});
					});
				}

			});
		}

		// Validating the reset password request
		else if( typeof req.body.old_password !== 'undefined' && typeof req.body.password !== 'undefined' && req.body.repeat_password ) {
			// Find the old password of the user
			User.schema.findOne({ '_id': user_id }, 'password')
			.then( function( response ) {
				if( typeof response.password === 'undefined' ) {
					redirect('/register');
				} else { 
					// Generating errors
					if( req.body.password !== req.body.repeat_password ) {
						errors = true;
						error_messages.repeat_password = 'passwords_do_not_match';
					}
					if( response.password !== User.schema.encryptPassword( req.body.old_password ) ) {
						errors = true;
						error_messages.old_password = 'wrong_password';
					}
					if( !User.schema.validatePassword( req.body.password ) ) {
						errors = true;
						error_messages.password = 'password_should_be_at_least_6_characters_long';
					}
					if( errors ) {
						res.json( { 'success': false } );
					} else {
						// If there are no errors, the password gets reset
						User.schema.resetPassword( user_id, req.body.password )
						.then( function(){
							res.json( { 'success': true } );
						})
						.fail( function( error ) {
							res.json( { 'success': false } );
						});
					}
				}
			});
		} else {
			// If there are errors, do not update the profile
			if( errors ) {
				res.json( { 'success': false } );
			// Else, fetch the first name and the last name of the user from the database
			} else {
				Profile.schema.update({ '_id': user_id }, profile_data )
				.then( function( response ){
					res.json( { 'success': true } );
				});
			}
		}
	});
};


/**
 * Returns the html of the settings page
 * @param  {object} req
 * @param  {object} res
 */
exports.get_view = function( req, res ) {
	var user_id = req.session.user_id;

	// If there is no user id in the session, redirect to register screen
	if(!user_id) res.send('');

	// Check if the profile really exists
	Profile.schema.findOne({ '_id': user_id }, 'language')
	.then( function( response ) {

		var disciplines = ['100m','200m','400m','800m','1500m','3000m','60m_hurdles','100m_hurdles','110m_hurdles','400m_hurdles','3000m_steeple','4x100m_relay','4x400m_relay','marathon','high_jump','long_jump','triple_jump','pole_vault','shot_put','discus','hammer','javelin','pentathlon','heptathlon','decathlon'];
		var countries = ['AF','AX','AL','DZ','AS','AD','AO','AI','AQ','AG','AR','AM','AW','AU','AT','AZ','BS','BH','BD','BB','BY','BE','BZ','BJ','BM','BT','BO','BQ','BA','BW','BV','BR','IO','BN','BG','BF','BI','KH','CM','CA','CV','KY','CF','TD','CL','CN','CX','CC','CO','KM','CG','CD','CK','CR','CI','HR','CU','CW','CY','CZ','DK','DJ','DM','DO','EC','EG','SV','GQ','ER','EE','ET','FK','FO','FJ','FI','FR','GF','PF','TF','GA','GM','GE','DE','GH','GI','GR','GL','GD','GP','GU','GT','GG','GN','GW','GY','HT','HM','VA','HN','HK','HU','IS','IN','ID','IR','IQ','IE','IM','IL','IT','JM','JP','JE','JO','KZ','KE','KI','KP','KR','KW','KG','LA','LV','LB','LS','LR','LY','LI','LT','LU','MO','MK','MG','MW','MY','MV','ML','MT','MH','MQ','MR','MU','YT','MX','FM','MD','MC','MN','ME','MS','MA','MZ','MM','NA','NR','NP','NL','NC','NZ','NI','NE','NG','NU','NF','MP','NO','OM','PK','PW','PS','PA','PG','PY','PE','PH','PN','PL','PT','PR','QA','RE','RO','RU','RW','BL','SH','KN','LC','MF','PM','VC','WS','SM','ST','SA','SN','RS','SC','SL','SG','SX','SK','SI','SB','SO','ZA','GS','SS','ES','LK','SD','SR','SJ','SZ','SE','CH','SY','TW','TJ','TZ','TH','TL','TG','TK','TO','TT','TN','TR','TM','TC','TV','UG','UA','AE','GB','US','UM','UY','UZ','VU','VE','VN','VG','VI','WF','EH','YE','ZM','ZW'];
		var languages = {
			'en': 'English',
			'el': 'Ελληνικά',
			'ru': 'Русский'
		};
		
		var view_data = {
			'disciplines' : disciplines,
			'languages'   : languages,
			'countries'   : countries,
			'tr'          : translations[response.language],
			'section'     : 'settings'
		};

		res.render( 'settings', view_data );
	})
	.fail( function( error ) {
		res.send('');
	});
};

/**
 * Sends an error page in case a query fails
 * @param string error
 * @param object res
 */
function send_error_page( error, res ) {
	res.statusCode = 500;
	res.sendfile('./views/five_oh_oh.html');
}