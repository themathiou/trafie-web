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
        'cancel'				: 'Cancel',

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

    this.countries = {
        'AF' : 'Afghanistan',
        'AX' : 'Aland Islands',
        'AL' : 'Albania',
        'DZ' : 'Algeria',
        'AS' : 'American Samoa',
        'AD' : 'Andorra',
        'AO' : 'Angola',
        'AI' : 'Anguilla',
        'AQ' : 'Antarctica',
        'AG' : 'Antigua and Barbuda',
        'AR' : 'Argentina',
        'AM' : 'Armenia',
        'AW' : 'Aruba',
        'AU' : 'Australia',
        'AT' : 'Austria',
        'AZ' : 'Azerbaijan',
        'BS' : 'Bahamas',
        'BH' : 'Bahrain',
        'BD' : 'Bangladesh',
        'BB' : 'Barbados',
        'BY' : 'Belarus',
        'BE' : 'Belgium',
        'BZ' : 'Belize',
        'BJ' : 'Benin',
        'BM' : 'Bermuda',
        'BT' : 'Bhutan',
        'BO' : 'Bolivia, Plurinational State of',
        'BQ' : 'Bonaire, Sint Eustatius and Saba',
        'BA' : 'Bosnia and Herzegovina',
        'BW' : 'Botswana',
        'BV' : 'Bouvet Island',
        'BR' : 'Brazil',
        'IO' : 'British Indian Ocean Territory',
        'BN' : 'Brunei Darussalam',
        'BG' : 'Bulgaria',
        'BF' : 'Burkina Faso',
        'BI' : 'Burundi',
        'KH' : 'Cambodia',
        'CM' : 'Cameroon',
        'CA' : 'Canada',
        'CV' : 'Cape Verde',
        'KY' : 'Cayman Islands',
        'CF' : 'Central African Republic',
        'TD' : 'Chad',
        'CL' : 'Chile',
        'CN' : 'China',
        'CX' : 'Christmas Island',
        'CC' : 'Cocos (Keeling) Islands',
        'CO' : 'Colombia',
        'KM' : 'Comoros',
        'CG' : 'Congo',
        'CD' : 'Congo, The Democratic Republic of the',
        'CK' : 'Cook Islands',
        'CR' : 'Costa Rica',
        'CI' : 'Cote d\'Ivoire',
        'HR' : 'Croatia',
        'CU' : 'Cuba',
        'CW' : 'Curacao',
        'CY' : 'Cyprus',
        'CZ' : 'Czech Republic',
        'DK' : 'Denmark',
        'DJ' : 'Djibouti',
        'DM' : 'Dominica',
        'DO' : 'Dominican Republic',
        'EC' : 'Ecuador',
        'EG' : 'Egypt',
        'SV' : 'El Salvador',
        'GQ' : 'Equatorial Guinea',
        'ER' : 'Eritrea',
        'EE' : 'Estonia',
        'ET' : 'Ethiopia',
        'FK' : 'Falkland Islands (Malvinas)',
        'FO' : 'Faroe Islands',
        'FJ' : 'Fiji',
        'FI' : 'Finland',
        'FR' : 'France',
        'GF' : 'French Guiana',
        'PF' : 'French Polynesia',
        'TF' : 'French Southern Territories',
        'GA' : 'Gabon',
        'GM' : 'Gambia',
        'GE' : 'Georgia',
        'DE' : 'Germany',
        'GH' : 'Ghana',
        'GI' : 'Gibraltar',
        'GR' : 'Greece',
        'GL' : 'Greenland',
        'GD' : 'Grenada',
        'GP' : 'Guadeloupe',
        'GU' : 'Guam',
        'GT' : 'Guatemala',
        'GG' : 'Guernsey',
        'GN' : 'Guinea',
        'GW' : 'Guinea-Bissau',
        'GY' : 'Guyana',
        'HT' : 'Haiti',
        'HM' : 'Heard Island and McDonald Islands',
        'VA' : 'Holy See (Vatican City State)',
        'HN' : 'Honduras',
        'HK' : 'Hong Kong',
        'HU' : 'Hungary',
        'IS' : 'Iceland',
        'IN' : 'India',
        'ID' : 'Indonesia',
        'IR' : 'Iran, Islamic Republic of',
        'IQ' : 'Iraq',
        'IE' : 'Ireland',
        'IM' : 'Isle of Man',
        'IL' : 'Israel',
        'IT' : 'Italy',
        'JM' : 'Jamaica',
        'JP' : 'Japan',
        'JE' : 'Jersey',
        'JO' : 'Jordan',
        'KZ' : 'Kazakhstan',
        'KE' : 'Kenya',
        'KI' : 'Kiribati',
        'KP' : 'Korea, Democratic People\'s Republic of',
        'KR' : 'Korea, Republic of',
        'KW' : 'Kuwait',
        'KG' : 'Kyrgyzstan',
        'LA' : 'Lao People\'s Democratic Republic',
        'LV' : 'Latvia',
        'LB' : 'Lebanon',
        'LS' : 'Lesotho',
        'LR' : 'Liberia',
        'LY' : 'Libya',
        'LI' : 'Liechtenstein',
        'LT' : 'Lithuania',
        'LU' : 'Luxembourg',
        'MO' : 'Macao',
        'MK' : 'Macedonia, The Former Yugoslav Republic of',
        'MG' : 'Madagascar',
        'MW' : 'Malawi',
        'MY' : 'Malaysia',
        'MV' : 'Maldives',
        'ML' : 'Mali',
        'MT' : 'Malta',
        'MH' : 'Marshall Islands',
        'MQ' : 'Martinique',
        'MR' : 'Mauritania',
        'MU' : 'Mauritius',
        'YT' : 'Mayotte',
        'MX' : 'Mexico',
        'FM' : 'Micronesia, Federated States of',
        'MD' : 'Moldova, Republic of',
        'MC' : 'Monaco',
        'MN' : 'Mongolia',
        'ME' : 'Montenegro',
        'MS' : 'Montserrat',
        'MA' : 'Morocco',
        'MZ' : 'Mozambique',
        'MM' : 'Myanmar',
        'NA' : 'Namibia',
        'NR' : 'Nauru',
        'NP' : 'Nepal',
        'NL' : 'Netherlands',
        'NC' : 'New Caledonia',
        'NZ' : 'New Zealand',
        'NI' : 'Nicaragua',
        'NE' : 'Niger',
        'NG' : 'Nigeria',
        'NU' : 'Niue',
        'NF' : 'Norfolk Island',
        'MP' : 'Northern Mariana Islands',
        'NO' : 'Norway',
        'OM' : 'Oman',
        'PK' : 'Pakistan',
        'PW' : 'Palau',
        'PS' : 'Palestine, State of',
        'PA' : 'Panama',
        'PG' : 'Papua New Guinea',
        'PY' : 'Paraguay',
        'PE' : 'Peru',
        'PH' : 'Philippines',
        'PN' : 'Pitcairn',
        'PL' : 'Poland',
        'PT' : 'Portugal',
        'PR' : 'Puerto rico',
        'QA' : 'Qatar',
        'RE' : 'Reunion',
        'RO' : 'Romania',
        'RU' : 'Russian Federation',
        'RW' : 'Rwanda',
        'BL' : 'Saint Barthelemy',
        'SH' : 'Saint Helena, Ascension and Tristan da Cunha',
        'KN' : 'Saint Kitts and Nevis',
        'LC' : 'Saint Lucia',
        'MF' : 'Saint Martin (French Part)',
        'PM' : 'Saint Pierre and Miquelon',
        'VC' : 'Saint Vincent and the Grenadines',
        'WS' : 'Samoa',
        'SM' : 'San Marino',
        'ST' : 'Sao Tome and Principe',
        'SA' : 'Saudi Arabia',
        'SN' : 'Senegal',
        'RS' : 'Serbia',
        'SC' : 'Seychelles',
        'SL' : 'Sierra Leone',
        'SG' : 'Singapore',
        'SX' : 'Sint Maarten (Dutch Part)',
        'SK' : 'Slovakia',
        'SI' : 'Slovenia',
        'SB' : 'Solomon Islands',
        'SO' : 'Somalia',
        'ZA' : 'South Africa',
        'GS' : 'South Georgia and the South Sandwich Islands',
        'SS' : 'South Sudan',
        'ES' : 'Spain',
        'LK' : 'Sri Lanka',
        'SD' : 'Sudan',
        'SR' : 'Suriname',
        'SJ' : 'Svalbard and Jan Mayen',
        'SZ' : 'Swaziland',
        'SE' : 'Sweden',
        'CH' : 'Switzerland',
        'SY' : 'Syrian Arab Republic',
        'TW' : 'Taiwan, Province of China',
        'TJ' : 'Tajikistan',
        'TZ' : 'Tanzania, United Republic of',
        'TH' : 'Thailand',
        'TL' : 'Timor-Leste',
        'TG' : 'Togo',
        'TK' : 'Tokelau',
        'TO' : 'Tonga',
        'TT' : 'Trinidad and Tobago',
        'TN' : 'Tunisia',
        'TR' : 'Turkey',
        'TM' : 'Turkmenistan',
        'TC' : 'Turks and Caicos Islands',
        'TV' : 'Tuvalu',
        'UG' : 'Uganda',
        'UA' : 'Ukraine',
        'AE' : 'United Arab Emirates',
        'GB' : 'United Kingdom',
        'US' : 'United States',
        'UM' : 'United States Minor Outlying Islands',
        'UY' : 'Uruguay',
        'UZ' : 'Uzbekistan',
        'VU' : 'Vanuatu',
        'VE' : 'Venezuela, Bolivarian Republic of',
        'VN' : 'Vietnam',
        'VG' : 'Virgin Islands, British',
        'VI' : 'Virgin Islands, U.S.',
        'WF' : 'Wallis and Futuna',
        'EH' : 'Western Sahara',
        'YE' : 'Yemen',
        'ZM' : 'Zambia',
        'ZW' : 'Zimbabwe'
    }
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
    var settings = this.mergeSections( settings, this.counties );
	return settings;
};

module.exports = En;