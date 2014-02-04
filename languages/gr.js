var Gr = function() {
	this.general = {
		'settings'		: 'Settings',
		'statistics'	: 'Statistics',
		'100m'			: '100m',
        '200m'			: '200m',
        '400m'			: '400m',
        '800m'			: '800m',
        '1500m'			: '1500m',
        '3000m'			: '3000m',
        '60m_hurdles'	: '60m Hurdles',
        '100m_hurdles'	: '100m Hurdles',
        '110m_hurdles'	: '100m Hurdles',
        '400m_hurdles'	: '400m Hurdles',
        '3000m_steeple'	: '3000m Steeple',
        '4x100m_relay'	: '4x100m Relay',
        '4x400m_relay'	: '4x400m Relay',
        'marathon'		: 'Marathon',
        'high_jump'		: 'High Jump',
        'long_jump'		: 'Long Jump',
        'triple_jump'	: 'Triple Jump',
        'pole_vault'	: 'Pole Vault',
        'shot_put'		: 'Shot Put',
        'discus'		: 'Discus',
        'hammer'		: 'Hammer',
        'javelin'		: 'Javelin',
        'pentathlon'	: 'Pentathlon',
        'heptathlon'	: 'Heptathlon',
        'decathlon'		: 'Decathlon',
        'hours'			: 'Hours',
        'minutes' 		: 'Minutes',
        'seconds'		: 'Seconds',
        'centiseconds' 	: 'Centiseconds',
        'meters'		: 'Meters',
        'm'				: 'm',
        'centimeters'	: 'Centimeters',
        'cm'			: 'cm',
        'points'		: 'Points',
        'submit'		: 'Submit',
        'cancel'		: 'Cancel'
	};

	this.settings = {
		'edit'				: 'Edit',
		'general_settings'	: 'General Settings',
		'logout'			: 'Logout',
		'first_name'		: 'First Name',
		'last_name'			: 'Last Name'
	};

	this.profile = {
		'add_new_activity'			: 'Add New Activity',
		'choose_your_discipline'	: 'Choose your discipline',
		'enter_your_performance'	: 'Enter your performance'
	};
};

Gr.prototype.mergeSections = function( section1, section2 ) {
	var new_section = {};
    for (var translation in section1) {
    	new_section[translation] = section1[translation];
    }
    for (var translation in section2) {
    	new_section[translation] = section2[translation];
    }
    return new_section;
};

Gr.prototype.getProfileTranslations = function() {
	var profile = this.mergeSections( this.general, this.profile );
	return profile;
};

Gr.prototype.getSettingsTranslations = function() {
	var settings = this.mergeSections( this.general, this.settings );
	return settings;
};

module.exports = Gr;