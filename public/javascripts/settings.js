/********************************************/
/* 				EVENTS HANDLERS				*/
/********************************************/

/* document.getElementById("id").event = function() { doSomething(); } */

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
		editField('first_name_existed', 'first_name', 'settingsFirstNameButtons', 'editFirstName');
	}
	document.getElementById("cancelEditFirstName").onclick = function() {
		cancelEditField('first_name_existed', 'first_name', 'settingsFirstNameButtons', 'editFirstName');
	}

	/* last name */
	document.getElementById("editLastName").onclick = function() {
		editField('last_name_existed', 'last_name', 'settingsLastNamebuttons', 'editLastName');
	}
	document.getElementById("cancelEditLastName").onclick = function() {
		cancelEditField('last_name_existed', 'last_name', 'settingsLastNamebuttons', 'editLastName');
	}

	/* gender */
	document.getElementById("editGender").onclick = function() {
		editField('gender_existed', 'gender', 'settingsGenderbuttons', 'editGender');
	}
	document.getElementById("cancelEditGender").onclick = function() {
		cancelEditField('gender_existed', 'gender', 'settingsGenderbuttons', 'editGender');
	}

	/* age */
	document.getElementById("editAge").onclick = function() {
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
		editField('main_discipline_existed', 'main_discipline_input', 'settingsMainDisciplineButtons', 'editMainDiscipline');
	}
	document.getElementById("cancelEditMainDiscipline").onclick = function() {
		cancelEditField('main_discipline_existed', 'main_discipline_input', 'settingsMainDisciplineButtons', 'editMainDiscipline');
	}

	/* country */
	document.getElementById("editCountry").onclick = function() {
		editField('country_existed', 'country_input', 'settingsCountryButtons', 'editCountry');
	}
	document.getElementById("cancelEditCountry").onclick = function() {
		cancelEditField('country_existed', 'country_input', 'settingsCountryButtons', 'editCountry');
	}

	/* about */
	document.getElementById("editAboutMe").onclick = function() {
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






