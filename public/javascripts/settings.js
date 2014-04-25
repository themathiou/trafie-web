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
	/* username */
	document.getElementById("editUsername").onclick = function() {
		/* closeOthers(); */
		editField( this.parentNode );
	}
	document.getElementById("cancelEditUsername").onclick = function() {
		cancelEditField(this.parentNode.parentNode);
	}

	/* first name */
	document.getElementById("editFirstName").onclick = function() {
		/* closeOthers(); */
		editField( this.parentNode );
	}
	document.getElementById("cancelEditFirstName").onclick = function() {
		cancelEditField( this.parentNode.parentNode );
	}

	/* last name */
	document.getElementById("editLastName").onclick = function() {
		/* closeOthers(); */
		editField( this.parentNode );
	}
	document.getElementById("cancelEditLastName").onclick = function() {
		cancelEditField( this.parentNode.parentNode );
	}

	/* gender */
	document.getElementById("editGender").onclick = function() {
		/* closeOthers(); */
		editField( this.parentNode );
	}
	document.getElementById("cancelEditGender").onclick = function() {
		cancelEditField( this.parentNode.parentNode );
	}

	/* age */
	document.getElementById("editAge").onclick = function() {
		/* closeOthers(); */
		editField( this.parentNode );
	}
	document.getElementById("cancelEditAge").onclick = function() {
		cancelEditField( this.parentNode.parentNode );
	}

	/* main discipline */
	document.getElementById("main_discipline_input").onchange = function() {
		show_specific_form(this);
	}
	document.getElementById("editMainDiscipline").onclick = function() {
		/* closeOthers(); */
		editField( this.parentNode );
	}
	document.getElementById("cancelEditMainDiscipline").onclick = function() {
		cancelEditField( this.parentNode.parentNode );
	}

	/* language */
	document.getElementById("editLanguage").onclick = function() {
		/* closeOthers(); */
		editField( this.parentNode );
	}
	document.getElementById("cancelEditLanguage").onclick = function() {
		cancelEditField( this.parentNode.parentNode );
	}

	/* date format */
	document.getElementById("editDateFormat").onclick = function() {
		/* closeOthers(); */
		editField( this.parentNode );
	}
	document.getElementById("cancelEditDateFormat").onclick = function() {
		cancelEditField( this.parentNode.parentNode );
	}

	/* country */
	document.getElementById("editCountry").onclick = function() {
		/* closeOthers(); */
		editField( this.parentNode );
	}
	document.getElementById("cancelEditCountry").onclick = function() {
		cancelEditField( this.parentNode.parentNode );
	}

	/* about */
	document.getElementById("editAboutMe").onclick = function() {
		/* closeOthers(); */
		editField( this.parentNode );
	}
	document.getElementById("cancelEditAboutMe").onclick = function() {
		cancelEditField( this.parentNode.parentNode );
	}





	/* -- Account Settings -- */
	document.getElementById("editPassword").onclick = function() {
		editHiddenField('changePassword', 'editPassword');
	}
	document.getElementById("cancelNewPassword").onclick = function() {
		cancelEditHiddenField('changePassword', 'editPassword');
	}

}






