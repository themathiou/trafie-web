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
	/* profile pic */
	document.getElementById("editProfilePicture").onclick = function() {
		/* closeOthers(); */
		editField( document.getElementById('profilePicDiv') );
	}
	document.getElementById("cancelEditProfilePicture").onclick = function() {
		cancelEditField( document.getElementById('profilePicDiv') );
	}

	/* username */
	document.getElementById("editUsername").onclick = function() {
		/* closeOthers(); */
		editField( document.getElementById('usernameDiv') );
	}
	document.getElementById("cancelEditUsername").onclick = function() {
		cancelEditField( document.getElementById('usernameDiv') );
	}
	document.getElementById("username").onkeyup = function() {
		if(  /^[A-Za-z_.0-9]+$/.test( this.value ) ) {
			document.getElementById("username_error").innerHTML = "";
			this.style.borderColor = 'green';
		} else {
			document.getElementById("username_error").innerHTML = " - can contain only latin characters, '.' or '_'  ";
			document.getElementById("username_error").className = "warning_message";
			this.style.borderColor = 'red';
		}
	}

	/* first name */
	document.getElementById("editFirstName").onclick = function() {
		/* closeOthers(); */
		editField( document.getElementById('firstNameDiv') );
	}
	document.getElementById("cancelEditFirstName").onclick = function() {
		cancelEditField( document.getElementById('firstNameDiv') );
	}
	document.getElementById("first_name").onkeyup = function() {
		if(  /^[A-Za-z ]+$/.test( this.value ) ) {
			document.getElementById("first_name_error").innerHTML = "";
			this.style.borderColor = 'green';
		} else {
			document.getElementById("first_name_error").innerHTML = " - must contain only latin characters";
			document.getElementById("first_name_error").className = "warning_message";
			this.style.borderColor = 'red';
		}
	}

	/* last name */
	document.getElementById("editLastName").onclick = function() {
		/* closeOthers(); */
		editField( document.getElementById('lastNameDiv') );
	}
	document.getElementById("cancelEditLastName").onclick = function() {
		cancelEditField( document.getElementById('lastNameDiv') );
	}
	document.getElementById("last_name").onkeyup = function() {
		if(  /^[A-Za-z ]+$/.test( this.value ) ) {
			document.getElementById("last_name_error").innerHTML = "";
			this.style.borderColor = 'green';
		} else {
			document.getElementById("last_name_error").innerHTML = " - must contain only latin characters";
			document.getElementById("last_name_error").className = "warning_message";
			this.style.borderColor = 'red';
		}
	}

	/* gender */
	document.getElementById("editGender").onclick = function() {
		/* closeOthers(); */
		editField( document.getElementById('genderDiv') );
	}
	document.getElementById("cancelEditGender").onclick = function() {
		cancelEditField( document.getElementById('genderDiv') );
	}

	/* age */
	document.getElementById("editAge").onclick = function() {
		/* closeOthers(); */
		editField( document.getElementById('ageDiv') );
	}
	document.getElementById("cancelEditAge").onclick = function() {
		cancelEditField( document.getElementById('ageDiv') );
	}

	/* main discipline */
	document.getElementById("main_discipline_input").onchange = function() {
		show_specific_form(this);
	}
	document.getElementById("editMainDiscipline").onclick = function() {
		/* closeOthers(); */
		editField( document.getElementById('mainDisciplineDiv') );
	}
	document.getElementById("cancelEditMainDiscipline").onclick = function() {
		cancelEditField( document.getElementById('mainDisciplineDiv') );
	}

	/* language */
	document.getElementById("editLanguage").onclick = function() {
		/* closeOthers(); */
		editField( document.getElementById('languageDiv') );
	}
	document.getElementById("cancelEditLanguage").onclick = function() {
		cancelEditField( document.getElementById('languageDiv') );
	}

	/* date format */
	document.getElementById("editDateFormat").onclick = function() {
		/* closeOthers(); */
		editField( document.getElementById('dateFormatDiv') );
	}
	document.getElementById("cancelEditDateFormat").onclick = function() {
		cancelEditField( document.getElementById('dateFormatDiv') );
	}

	/* country */
	document.getElementById("editCountry").onclick = function() {
		/* closeOthers(); */
		editField( document.getElementById('countryDiv') );
	}
	document.getElementById("cancelEditCountry").onclick = function() {
		cancelEditField( document.getElementById('countryDiv') );
	}

	/* about */
	document.getElementById("editAboutMe").onclick = function() {
		/* closeOthers(); */
		editField( document.getElementById('aboutMeDiv') );
	}
	document.getElementById("cancelEditAboutMe").onclick = function() {
		cancelEditField( document.getElementById('aboutMeDiv') );
	}





	/* -- Account Settings -- */
	document.getElementById("editPassword").onclick = function() {
		editField( document.getElementById('changePasswordDiv') );
	}
	document.getElementById("cancelNewPassword").onclick = function() {
		cancelEditField( document.getElementById('changePasswordDiv') );
	}
	// Handler for password input field when loses focus
	document.getElementById("password").onkeyup = function() {
		if( this.value.length > 5 ) {
			console.log( 'valid email' );
			document.getElementById("password_error").innerHTML = "";
			this.style.borderColor = 'green';
		} else {
			document.getElementById("password_error").innerHTML = " - must be at least 6 characters long";
			document.getElementById("password_error").className = "warning_message";
			this.style.borderColor = 'red';
		}
	}

	// Handler for repeat password input field when loses focus
	document.getElementById("repeat_password").onkeyup = function() {
		if( this.value == document.getElementById("password").value  ) {
			console.log( 'valid pass combination' );
			document.getElementById("repeat_password_error").innerHTML = "";
			this.style.borderColor = 'green';
		} else {
			document.getElementById("repeat_password_error").innerHTML = "Passwords doesn't match";
			this.style.borderColor = 'red';
		}
	}

}






