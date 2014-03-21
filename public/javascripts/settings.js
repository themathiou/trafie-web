/********************************************/
/* 				EVENTS HANDLERS				*/
/********************************************/

/* document.getElementById("id").event = function() { doSomething(); } */
/**
 * settingsHandlers() : the handlers for the buttons in settings
 */
function closeOthers() {
	cancelEditField('first_name_existed', 'first_name', 'settingsFirstNameButtons', 'editFirstName');
	cancelEditField('last_name_existed', 'last_name', 'settingsLastNamebuttons', 'editLastName');
	cancelEditField('gender_existed', 'gender', 'settingsGenderbuttons', 'editGender');
	cancelEditField('birthday_existed', 'birthday', 'settingsAgebuttons', 'editAge');
	cancelEditField('main_discipline_existed', 'main_discipline_input', 'settingsMainDisciplineButtons', 'editMainDiscipline');
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






