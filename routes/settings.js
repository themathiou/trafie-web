var fs = require('fs'),
		path = require('path'),
		root_dir = path.dirname( require.main.filename );

// Initialize translations
var translations = require('../languages/translations.js');

var User = require('../models/user.js');
var Profile = require('../models/profile.js');


exports.get = function( req, res ){
	// If there is no user id in the session, return null
	if( typeof req.session.user_id === 'undefined') {
		res.json( null );
		return false;
	}

	var first_name, last_name,
		user_id = req.session.user_id,
		update = '',
		error_messages = '';

	// Else, fetch the first name and the last name of the user from the database
	Profile.schema.findOne({ '_id': user_id }, 'first_name last_name discipline about male country birthday picture language date_format username')
	.then( function( profile ) {
		// If the user was not found, return null
		if( typeof profile.first_name === 'undefined') {
			res.json( null );
			return false;
		}

		var tr = translations[profile.language];

		// Format the data that will go to the front end
		var gender = '';
		if( profile.male === true ) {
			gender = 'male';
		}
		else if( profile.male === false ) {
			gender = 'female';
		}
		else {
			gender = 'no_gender_selected';
		}

		var picture = profile.picture ? profile.picture : ( profile.male ? '/images/profile_pics/default_male.png' : '/images/profile_pics/default_female.png' );

		var data = {
			'user': {
				'_id'         			: user_id,
				'first_name'  			: profile.first_name,
				'last_name'   			: profile.last_name,
				'discipline'  			: profile.discipline,
				'discipline_formatted' 	: tr[profile.discipline],
				'about'       			: profile.about,
				'gender'				: gender,
				'gender_formatted'		: tr[gender],
				'country'     			: profile.country,
				'country_formatted'		: tr[profile.country],
				'birthday'    			: profile.birthday,
				'picture'     			: picture,
				'language'    			: profile.language,
				'date_format' 			: profile.date_format,
				'username'    			: profile.username
			}
		};

		res.json( data );
	})
	.fail( function( error ) {
		send_error_page( error, res );
	});
};


exports.post = function( req, res ) {
	// If there is no user id in the session, redirect to register screen
	if( typeof req.session.user_id === 'undefined') {
		res.json(null);
		return false;
	}

	var user_id = req.session.user_id;

	// Check if the profile really exists
	Profile.schema.findOne( { '_id': user_id }, 'first_name language' )
	.then( function( profile ) {
		// If the profile doesn't exist, redirect
		if( typeof profile.first_name === 'undefined' ) {
			res.json( null );
			return false;
		}

		var error_messages = {},
			update = '',
			profile_data = {},
			user_data = {},
			tr = translations[profile.language],
			response = {
				'success'			: true,
				'value'				: '',
				'translated_value'	: '',
				'message'			: ''
			};

		// Validating first name
		if( typeof req.body.first_name !== 'undefined' ) {
			if( !Profile.schema.validateName( req.body.first_name ) ) {
				response.success = false;
				response.message = tr['invalid_name'];
			} else {
				profile_data.first_name = req.body.first_name;
				response.value = req.body.first_name;
			}
		}

		// Validating last name
		if( typeof req.body.last_name !== 'undefined' ) {
			if( !Profile.schema.validateName( req.body.last_name ) ) {
				response.success = false;
				response.message = tr['invalid_name'];
			} else {
				profile_data.last_name = req.body.last_name;
				response.value = req.body.last_name;
			}
		}

		// Validating birthday
		if( typeof req.body.birthday !== 'undefined' ) {
			var birthday = Profile.schema.validateBirthday( req.body.birthday );
			if( birthday ) {
				profile_data.birthday = birthday;
				response.value = profile_data.birthday;
			} else {
				response.success = false;
			}
		}

		// Validating gender
		if( typeof req.body.gender !== 'undefined' ) {
			if( !Profile.schema.validateGender( req.body.gender ) ) {
				response.success = false;
			} else {
				profile_data.male = req.body.gender == 'male';
				response.value = req.body.gender;
				response.translated_value = tr[req.body.gender];
			}
		}

		// Validating country
		if( typeof req.body.country !== 'undefined' ) {
			if( !Profile.schema.validateCountry( req.body.country ) ) {
				response.success = false;
			} else {
				profile_data.country = req.body.country;
				response.value = req.body.country;
				response.translated_value = tr[req.body.country];
			}
		}

		// Validating discipline
		if( typeof req.body.discipline !== 'undefined' ) {
			if( !Profile.schema.validateDiscipline( req.body.discipline ) ) {
				response.success = false;
			} else {
				profile_data.discipline = req.body.discipline;
				response.value = req.body.discipline;
				response.translated_value = tr[req.body.discipline];
			}
		}

		// Validating the about me text
		if( typeof req.body.about !== 'undefined' ) {
			if( !Profile.schema.validateAbout( req.body.about ) ) {
				response.success = false;
			} else {
				profile_data.about = req.body.about;
				response.value = req.body.about;
				response.translated_value = tr[req.body.about];
			}
		}

		// Validating language
		if( typeof req.body.language !== 'undefined' ) {
			if( !Profile.schema.validateLanguage( req.body.language ) ) {
				response.success = false;
			} else {
				profile_data.language = req.body.language;
				response.value = req.body.about;
				response.translated_value = tr[req.body.about];
			}
		}

		// Validating date format
		if( typeof req.body.date_format !== 'undefined' ) {
			if( !Profile.schema.validateDateFormat( req.body.date_format ) ) {
				response.success = false;
			} else {
				profile_data.date_format = req.body.date_format;
				response.value = req.body.date_format;
				response.translated_value = tr[req.body.date_format];
			}
		}

		// Validating date format
		if( typeof req.body.username !== 'undefined' ) {
			if( !Profile.schema.validateUsername( req.body.username ) ) {
				response.success = false;
				response.message = tr['invalid_username'];
				res.json( response );
			} else {
				var username = req.body.username.toLowerCase();
				Profile.schema.findOne({ 'username': username }, '_id')
				.then( function( profile ) {
					if( profile == null ) {
						profile_data.username = username;
						response.value = username;
						Profile.update({ '_id': user_id }, { $set: profile_data }, { upsert: true }, function( error ) {
							res.json( response );
							return;
						})
						.fail( function( error ) {
							send_error_page( error, res );
							return
						});
					} else {
						response.success = false;
						if( profile._id !== user_id ) {
							response.message = tr['username_exists'];
						}
						res.json( response );
					}
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
					response.success = false;
					response.message = tr['uploaded_image_too_large'];
				}

				// If the file type is acceptable
				if( accepted_file_types.indexOf( req.files.profile_pic.type ) < 0 ) {
					response.success = false;
					response.message = tr['uploaded_image_wrong_type'];
				}

				if( response.success ) {
					profile_data.picture = '/images/profile_pics/' + user_id + '.' + extension;

					// Save the file in the images folder
					fs.writeFile( root_dir + '/public' + profile_data.picture, data, function ( err ) {
						// Update the database
						Profile.update({ '_id': user_id }, { $set: profile_data }, { upsert: true }, function( error ) {
							res.json( response );
						});
					});
				}

			});
		}

		// Validating the reset password request
		else if( typeof req.body.old_password !== 'undefined' && typeof req.body.password !== 'undefined' && req.body.repeat_password ) {
			// Find the old password of the user
			User.schema.findOne({ '_id': user_id }, 'password')
			.then( function( user ) {
				if( typeof user.password === 'undefined' ) {
					response.success = false;
					res.json( response );
				} else { 
					// Generating errors
					if( req.body.password !== req.body.repeat_password ) {
						response.success = false;
						response.message = tr['passwords_do_not_match'];
					}
					if( user.password !== User.schema.encryptPassword( req.body.old_password ) ) {
						response.success = false;
						response.message = tr['wrong_password'];
					}
					if( !User.schema.validatePassword( req.body.password ) ) {
						response.success = false;
						response.message = tr['password_should_be_at_least_6_characters_long'];
					}
					if( response.success ) {
						// If there are no errors, the password gets reset
						User.schema.resetPassword( user_id, req.body.password )
						.then( function(){
							res.json( response );
						})
						.fail( function( error ) {
							send_error_page( error, res );
						});
					} else {
						res.json( response );
					}
				}
			});
		} else {
			// Else, fetch the first name and the last name of the user from the database
			if( response.success ) {
				Profile.schema.update({ '_id': user_id }, profile_data )
				.then( function( profile ){
					res.json( response );
				});
			// If there are errors, do not update the profile
			} else {
				res.json( response );
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
	// If there is no user id in the session, redirect to register screen
	if( typeof req.session.user_id === 'undefined') {
		res.send('');
		return false;
	}

	var user_id = req.session.user_id;

	// Check if the profile really exists
	Profile.schema.findOne({ '_id': user_id }, 'language')
	.then( function( profile ) {

		var tr = translations[profile.language];
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
			'tr'          : translations[profile.language],
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
	res.json( null );
}