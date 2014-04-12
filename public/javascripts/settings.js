/********************************************/
/* 				EVENTS HANDLERS				*/
/********************************************/

/* document.getElementById("id").event = function() { doSomething(); } */

/**
 * closeOthers() : when we choose to edit a field
 *all others should be in their un-editable format
 */
function closeOthers() {
	cancelEditField('first_name_existed', 'first_name', 'settingsFirstNameButtons', 'editFirstName');
	cancelEditField('last_name_existed', 'last_name', 'settingsLastNamebuttons', 'editLastName');
	cancelEditField('gender_existed', 'gender', 'settingsGenderbuttons', 'editGender');
	cancelEditField('birthday_existed', 'birthday', 'settingsAgebuttons', 'editAge');
	cancelEditField('main_discipline_existed', 'main_discipline_input', 'settingsMainDisciplineButtons', 'editMainDiscipline');
	cancelEditField('language_existed', 'language_input', 'settingsLanguageButtons', 'editLanguage');
	cancelEditField('date_format_existed', 'date_format_input', 'settingsDateFormatButtons', 'editDateFormat');
	cancelEditField('country_existed', 'country_input', 'settingsCountryButtons', 'editCountry');
	cancelEditField('about_existed', 'about_me', 'settingsAboutMeButtons', 'editAboutMe');


}


/**
 * settingsHandlers() : the handlers for the buttons in settings
 */
function settingsHandlers() {
	document.getElementById("profileSettingsTab").onclick = function() {
		showSettingsTab('profileSettings');
	}
	document.getElementById("accountSettingsTab").onclick = function() {
		showSettingsTab('accountSettings');
	}

	/* -- Profile Settings */
	/* first name */
	document.getElementById("editFirstName").onclick = function() {
		closeOthers();
		editField('first_name_existed', 'first_name', 'settingsFirstNameButtons', 'editFirstName');
	}
	document.getElementById("cancelEditFirstName").onclick = function() {
		cancelEditField('first_name_existed', 'first_name', 'settingsFirstNameButtons', 'editFirstName');
	}

	/* last name */
	document.getElementById("editLastName").onclick = function() {
		closeOthers();
		editField('last_name_existed', 'last_name', 'settingsLastNamebuttons', 'editLastName');
	}
	document.getElementById("cancelEditLastName").onclick = function() {
		cancelEditField('last_name_existed', 'last_name', 'settingsLastNamebuttons', 'editLastName');
	}

	/* gender */
	document.getElementById("editGender").onclick = function() {
		closeOthers();
		editField('gender_existed', 'gender', 'settingsGenderbuttons', 'editGender');
	}
	document.getElementById("cancelEditGender").onclick = function() {
		cancelEditField('gender_existed', 'gender', 'settingsGenderbuttons', 'editGender');
	}

	/* age */
	document.getElementById("editAge").onclick = function() {
		closeOthers();
		editField('birthday_existed', 'birthday', 'settingsAgebuttons', 'editAge');
	}
	document.getElementById("cancelEditAge").onclick = function() {
		cancelEditField('birthday_existed', 'birthday', 'settingsAgebuttons', 'editAge');
	}

	/* main discipline */
	document.getElementById("main_discipline_input").onchange = function() {
		show_specific_form(this);
	}
	document.getElementById("editMainDiscipline").onclick = function() {
		closeOthers();
		editField('main_discipline_existed', 'main_discipline_input', 'settingsMainDisciplineButtons', 'editMainDiscipline');
	}
	document.getElementById("cancelEditMainDiscipline").onclick = function() {
		cancelEditField('main_discipline_existed', 'main_discipline_input', 'settingsMainDisciplineButtons', 'editMainDiscipline');
	}

	/* language */
	document.getElementById("editLanguage").onclick = function() {
		closeOthers();
		editField('language_existed', 'language_input', 'settingsLanguageButtons', 'editLanguage');
	}
	document.getElementById("cancelEditLanguage").onclick = function() {
		cancelEditField('language_existed', 'language_input', 'settingsLanguageButtons', 'editLanguage');
	}

	/* date format */
	document.getElementById("editDateFormat").onclick = function() {
		closeOthers();
		editField('date_format_existed', 'date_format_input', 'settingsDateFormatButtons', 'editDateFormat');
	}
	document.getElementById("cancelEditDateFormat").onclick = function() {
		cancelEditField('date_format_existed', 'date_format_input', 'settingsDateFormatButtons', 'editDateFormat');
	}

	/* country */
	document.getElementById("editCountry").onclick = function() {
		closeOthers();
		editField('country_existed', 'country_input', 'settingsCountryButtons', 'editCountry');
	}
	document.getElementById("cancelEditCountry").onclick = function() {
		cancelEditField('country_existed', 'country_input', 'settingsCountryButtons', 'editCountry');
	}

	/* about */
	document.getElementById("editAboutMe").onclick = function() {
		closeOthers();
		editField('about_existed', 'about_me', 'settingsAboutMeButtons', 'editAboutMe');
	}
	document.getElementById("cancelEditAboutMe").onclick = function() {
		cancelEditField('about_existed', 'about_me', 'settingsAboutMeButtons', 'editAboutMe');
	}

	/* -- Account Settings */
	document.getElementById("editPassword").onclick = function() {
		editHiddenField('changePassword', 'editPassword');
	}
	document.getElementById("cancelNewPassword").onclick = function() {
		cancelEditHiddenField('changePassword', 'editPassword');
	}
}






