var En = function() {
	this.general = {
		'settings'				: 'Settings',
		'statistics'			: 'Statistics',
		'100m'					: '100m',
        '200m'					: '200m',
        '400m'					: '400m',
        '800m'					: '800m',
        '1500m'					: '1500m',
        '3000m'					: '3000m',
        '60m_hurdles'			: '60m Hurdles',
        '100m_hurdles'			: '100m Hurdles',
        '110m_hurdles'			: '100m Hurdles',
        '400m_hurdles'			: '400m Hurdles',
        '3000m_steeple'			: '3000m Steeple',
        '4x100m_relay'			: '4x100m Relay',
        '4x400m_relay'			: '4x400m Relay',
        'marathon'				: 'Marathon',
        'high_jump'				: 'High Jump',
        'long_jump'				: 'Long Jump',
        'triple_jump'			: 'Triple Jump',
        'pole_vault'			: 'Pole Vault',
        'shot_put'				: 'Shot Put',
        'discus'				: 'Discus',
        'hammer'				: 'Hammer',
        'javelin'				: 'Javelin',
        'pentathlon'			: 'Pentathlon',
        'heptathlon'			: 'Heptathlon',
        'decathlon'				: 'Decathlon',
        'hours'					: 'Hours',
        'hours_short'			: 'hours',
        'minutes' 				: 'Minutes',
        'minutes_short' 		: 'min',
        'seconds'				: 'Seconds',
        'seconds_short'			: 'sec',
        'centiseconds' 			: 'Centiseconds',
        'centiseconds_short' 	: 'csec',
        'meters'				: 'Meters',
        'meters_short'			: 'm',
        'centimeters'			: 'Centimeters',
        'centimeters_short'		: 'cm',
        'points'				: 'Points',
        'submit'				: 'Submit',
        'save'					: 'Save',
        'cancel'				: 'Cancel'
	};

	this.settings = {
		'edit'					 : 'Edit',
		'general_settings'		 : 'General Settings',
		'logout'				 : 'Logout',
		'first_name'			 : 'First Name',
		'last_name'				 : 'Last Name',
		'choose_your_discipline' : 'Choose your discipline'
	};

	this.profile = {
		'add_new_activity'			: 'Add New Activity',
		'choose_your_discipline'	: 'Choose your discipline',
		'enter_your_performance'	: 'Enter your performance'
	};

    this.countries = [];
    this.countries['AF'] = 'Afghanistan';
    this.countries['AX'] = 'Aland Islands';
    this.countries['AL'] = 'Albania';
    this.countries['DZ'] = 'Algeria';
    this.countries['AS'] = 'American Samoa';
    this.countries['AD'] = 'Andorra';
    this.countries['AO'] = 'Angola';
    this.countries['AI'] = 'Anguilla';
    this.countries['AQ'] = 'Antarctica';
    this.countries['AG'] = 'Antigua and Barbuda';
    this.countries['AR'] = 'Argentina';
    this.countries['AM'] = 'Armenia';
    this.countries['AW'] = 'Aruba';
    this.countries['AU'] = 'Australia';
    this.countries['AT'] = 'Austria';
    this.countries['AZ'] = 'Azerbaijan';
    this.countries['BS'] = 'Bahamas';
    this.countries['BH'] = 'Bahrain';
    this.countries['BD'] = 'Bangladesh';
    this.countries['BB'] = 'Barbados';
    this.countries['BY'] = 'Belarus';
    this.countries['BE'] = 'Belgium';
    this.countries['BZ'] = 'Belize';
    this.countries['BJ'] = 'Benin';
    this.countries['BM'] = 'Bermuda';
    this.countries['BT'] = 'Bhutan';
    this.countries['BO'] = 'Bolivia, Plurinational State of';
    this.countries['BQ'] = 'Bonaire, Sint Eustatius and Saba';
    this.countries['BA'] = 'Bosnia and Herzegovina';
    this.countries['BW'] = 'Botswana';
    this.countries['BV'] = 'Bouvet Island';
    this.countries['BR'] = 'Brazil';
    this.countries['IO'] = 'British Indian Ocean Territory';
    this.countries['BN'] = 'Brunei Darussalam';
    this.countries['BG'] = 'Bulgaria';
    this.countries['BF'] = 'Burkina Faso';
    this.countries['BI'] = 'Burundi';
    this.countries['KH'] = 'Cambodia';
    this.countries['CM'] = 'Cameroon';
    this.countries['CA'] = 'Canada';
    this.countries['CV'] = 'Cape Verde';
    this.countries['KY'] = 'Cayman Islands';
    this.countries['CF'] = 'Central African Republic';
    this.countries['TD'] = 'Chad';
    this.countries['CL'] = 'Chile';
    this.countries['CN'] = 'China';
    this.countries['CX'] = 'Christmas Island';
    this.countries['CC'] = 'Cocos (Keeling) Islands';
    this.countries['CO'] = 'Colombia';
    this.countries['KM'] = 'Comoros';
    this.countries['CG'] = 'Congo';
    this.countries['CD'] = 'Congo, The Democratic Republic of the';
    this.countries['CK'] = 'Cook Islands';
    this.countries['CR'] = 'Costa Rica';
    this.countries['CI'] = 'Cote d\'Ivoire';
    this.countries['HR'] = 'Croatia';
    this.countries['CU'] = 'Cuba';
    this.countries['CW'] = 'Curacao';
    this.countries['CY'] = 'Cyprus';
    this.countries['CZ'] = 'Czech Republic';
    this.countries['DK'] = 'Denmark';
    this.countries['DJ'] = 'Djibouti';
    this.countries['DM'] = 'Dominica';
    this.countries['DO'] = 'Dominican Republic';
    this.countries['EC'] = 'Ecuador';
    this.countries['EG'] = 'Egypt';
    this.countries['SV'] = 'El Salvador';
    this.countries['GQ'] = 'Equatorial Guinea';
    this.countries['ER'] = 'Eritrea';
    this.countries['EE'] = 'Estonia';
    this.countries['ET'] = 'Ethiopia';
    this.countries['FK'] = 'Falkland Islands (Malvinas)';
    this.countries['FO'] = 'Faroe Islands';
    this.countries['FJ'] = 'Fiji';
    this.countries['FI'] = 'Finland';
    this.countries['FR'] = 'France';
    this.countries['GF'] = 'French Guiana';
    this.countries['PF'] = 'French Polynesia';
    this.countries['TF'] = 'French Southern Territories';
    this.countries['GA'] = 'Gabon';
    this.countries['GM'] = 'Gambia';
    this.countries['GE'] = 'Georgia';
    this.countries['DE'] = 'Germany';
    this.countries['GH'] = 'Ghana';
    this.countries['GI'] = 'Gibraltar';
    this.countries['GR'] = 'Greece';
    this.countries['GL'] = 'Greenland';
    this.countries['GD'] = 'Grenada';
    this.countries['GP'] = 'Guadeloupe';
    this.countries['GU'] = 'Guam';
    this.countries['GT'] = 'Guatemala';
    this.countries['GG'] = 'Guernsey';
    this.countries['GN'] = 'Guinea';
    this.countries['GW'] = 'Guinea-Bissau';
    this.countries['GY'] = 'Guyana';
    this.countries['HT'] = 'Haiti';
    this.countries['HM'] = 'Heard Island and McDonald Islands';
    this.countries['VA'] = 'Holy See (Vatican City State)';
    this.countries['HN'] = 'Honduras';
    this.countries['HK'] = 'Hong Kong';
    this.countries['HU'] = 'Hungary';
    this.countries['IS'] = 'Iceland';
    this.countries['IN'] = 'India';
    this.countries['ID'] = 'Indonesia';
    this.countries['IR'] = 'Iran, Islamic Republic of';
    this.countries['IQ'] = 'Iraq';
    this.countries['IE'] = 'Ireland';
    this.countries['IM'] = 'Isle of Man';
    this.countries['IL'] = 'Israel';
    this.countries['IT'] = 'Italy';
    this.countries['JM'] = 'Jamaica';
    this.countries['JP'] = 'Japan';
    this.countries['JE'] = 'Jersey';
    this.countries['JO'] = 'Jordan';
    this.countries['KZ'] = 'Kazakhstan';
    this.countries['KE'] = 'Kenya';
    this.countries['KI'] = 'Kiribati';
    this.countries['KP'] = 'Korea, Democratic People\'s Republic of';
    this.countries['KR'] = 'Korea, Republic of';
    this.countries['KW'] = 'Kuwait';
    this.countries['KG'] = 'Kyrgyzstan';
    this.countries['LA'] = 'Lao People\'s Democratic Republic';
    this.countries['LV'] = 'Latvia';
    this.countries['LB'] = 'Lebanon';
    this.countries['LS'] = 'Lesotho';
    this.countries['LR'] = 'Liberia';
    this.countries['LY'] = 'Libya';
    this.countries['LI'] = 'Liechtenstein';
    this.countries['LT'] = 'Lithuania';
    this.countries['LU'] = 'Luxembourg';
    this.countries['MO'] = 'Macao';
    this.countries['MK'] = 'Macedonia, The Former Yugoslav Republic of';
    this.countries['MG'] = 'Madagascar';
    this.countries['MW'] = 'Malawi';
    this.countries['MY'] = 'Malaysia';
    this.countries['MV'] = 'Maldives';
    this.countries['ML'] = 'Mali';
    this.countries['MT'] = 'Malta';
    this.countries['MH'] = 'Marshall Islands';
    this.countries['MQ'] = 'Martinique';
    this.countries['MR'] = 'Mauritania';
    this.countries['MU'] = 'Mauritius';
    this.countries['YT'] = 'Mayotte';
    this.countries['MX'] = 'Mexico';
    this.countries['FM'] = 'Micronesia, Federated States of';
    this.countries['MD'] = 'Moldova, Republic of';
    this.countries['MC'] = 'Monaco';
    this.countries['MN'] = 'Mongolia';
    this.countries['ME'] = 'Montenegro';
    this.countries['MS'] = 'Montserrat';
    this.countries['MA'] = 'Morocco';
    this.countries['MZ'] = 'Mozambique';
    this.countries['MM'] = 'Myanmar';
    this.countries['NA'] = 'Namibia';
    this.countries['NR'] = 'Nauru';
    this.countries['NP'] = 'Nepal';
    this.countries['NL'] = 'Netherlands';
    this.countries['NC'] = 'New Caledonia';
    this.countries['NZ'] = 'New Zealand';
    this.countries['NI'] = 'Nicaragua';
    this.countries['NE'] = 'Niger';
    this.countries['NG'] = 'Nigeria';
    this.countries['NU'] = 'Niue';
    this.countries['NF'] = 'Norfolk Island';
    this.countries['MP'] = 'Northern Mariana Islands';
    this.countries['NO'] = 'Norway';
    this.countries['OM'] = 'Oman';
    this.countries['PK'] = 'Pakistan';
    this.countries['PW'] = 'Palau';
    this.countries['PS'] = 'Palestine, State of';
    this.countries['PA'] = 'Panama';
    this.countries['PG'] = 'Papua New Guinea';
    this.countries['PY'] = 'Paraguay';
    this.countries['PE'] = 'Peru';
    this.countries['PH'] = 'Philippines';
    this.countries['PN'] = 'Pitcairn';
    this.countries['PL'] = 'Poland';
    this.countries['PT'] = 'Portugal';
    this.countries['PR'] = 'Puerto rico';
    this.countries['QA'] = 'Qatar';
    this.countries['RE'] = 'Reunion';
    this.countries['RO'] = 'Romania';
    this.countries['RU'] = 'Russian Federation';
    this.countries['RW'] = 'Rwanda';
    this.countries['BL'] = 'Saint Barthelemy';
    this.countries['SH'] = 'Saint Helena, Ascension and Tristan da Cunha';
    this.countries['KN'] = 'Saint Kitts and Nevis';
    this.countries['LC'] = 'Saint Lucia';
    this.countries['MF'] = 'Saint Martin (French Part)';
    this.countries['PM'] = 'Saint Pierre and Miquelon';
    this.countries['VC'] = 'Saint Vincent and the Grenadines';
    this.countries['WS'] = 'Samoa';
    this.countries['SM'] = 'San Marino';
    this.countries['ST'] = 'Sao Tome and Principe';
    this.countries['SA'] = 'Saudi Arabia';
    this.countries['SN'] = 'Senegal';
    this.countries['RS'] = 'Serbia';
    this.countries['SC'] = 'Seychelles';
    this.countries['SL'] = 'Sierra Leone';
    this.countries['SG'] = 'Singapore';
    this.countries['SX'] = 'Sint Maarten (Dutch Part)';
    this.countries['SK'] = 'Slovakia';
    this.countries['SI'] = 'Slovenia';
    this.countries['SB'] = 'Solomon Islands';
    this.countries['SO'] = 'Somalia';
    this.countries['ZA'] = 'South Africa';
    this.countries['GS'] = 'South Georgia and the South Sandwich Islands';
    this.countries['SS'] = 'South Sudan';
    this.countries['ES'] = 'Spain';
    this.countries['LK'] = 'Sri Lanka';
    this.countries['SD'] = 'Sudan';
    this.countries['SR'] = 'Suriname';
    this.countries['SJ'] = 'Svalbard and Jan Mayen';
    this.countries['SZ'] = 'Swaziland';
    this.countries['SE'] = 'Sweden';
    this.countries['CH'] = 'Switzerland';
    this.countries['SY'] = 'Syrian Arab Republic';
    this.countries['TW'] = 'Taiwan, Province of China';
    this.countries['TJ'] = 'Tajikistan';
    this.countries['TZ'] = 'Tanzania, United Republic of';
    this.countries['TH'] = 'Thailand';
    this.countries['TL'] = 'Timor-Leste';
    this.countries['TG'] = 'Togo';
    this.countries['TK'] = 'Tokelau';
    this.countries['TO'] = 'Tonga';
    this.countries['TT'] = 'Trinidad and Tobago';
    this.countries['TN'] = 'Tunisia';
    this.countries['TR'] = 'Turkey';
    this.countries['TM'] = 'Turkmenistan';
    this.countries['TC'] = 'Turks and Caicos Islands';
    this.countries['TV'] = 'Tuvalu';
    this.countries['UG'] = 'Uganda';
    this.countries['UA'] = 'Ukraine';
    this.countries['AE'] = 'United Arab Emirates';
    this.countries['GB'] = 'United Kingdom';
    this.countries['US'] = 'United States';
    this.countries['UM'] = 'United States Minor Outlying Islands';
    this.countries['UY'] = 'Uruguay';
    this.countries['UZ'] = 'Uzbekistan';
    this.countries['VU'] = 'Vanuatu';
    this.countries['VE'] = 'Venezuela, Bolivarian Republic of';
    this.countries['VN'] = 'Vietnam';
    this.countries['VG'] = 'Virgin Islands, British';
    this.countries['VI'] = 'Virgin Islands, U.S.';
    this.countries['WF'] = 'Wallis and Futuna';
    this.countries['EH'] = 'Western Sahara';
    this.countries['YE'] = 'Yemen';
    this.countries['ZM'] = 'Zambia';
    this.countries['ZW'] = 'Zimbabwe';
};

En.prototype.mergeSections = function( section1, section2 ) {
	var new_section = {};
    for (var translation in section1) {
    	new_section[translation] = section1[translation];
    }
    for (var translation in section2) {
    	new_section[translation] = section2[translation];
    }
    return new_section;
};

En.prototype.getProfileTranslations = function() {
	var profile = this.mergeSections( this.general, this.profile );
	return profile;
};

En.prototype.getSettingsTranslations = function() {
	var settings = this.mergeSections( this.general, this.settings );
    settings['countries'] = this.countries;
	return settings;
};

module.exports = En;