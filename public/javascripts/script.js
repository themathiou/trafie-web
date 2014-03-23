/********************************************/
/* 				SETTINGS 					*/
/********************************************/

/**
 * editField() : shows the elements for editing a field
 * @param existedID : the span that contains the existed value
 * @param fieldID : the field we want to make editable
 * @param saveID : the 'save' button id for show/hide
 * @param cancelID : the 'cancel' button id for show/hide
 * @param editID : the 'edit' button id for show/hide
 */
function editField( existedID, fieldID, saveID, editID ) {
	document.getElementById(existedID).style.display = 'none';
    document.getElementById(fieldID).style.display = 'block';

    document.getElementById(saveID).className = 'submitButtonsVisible';
    document.getElementById(editID).style.display = 'none';
    document.getElementById(editID).parentNode.parentNode.className = 'settingsElement editable' ;
}

/**
 * editHiddenField() : shows the elements for editing a field
 * @param hiddenFieldID : the field we want to make editable
 * @param editID : the 'edit' button id for show/hide
 */
function editHiddenField( hiddenFieldID, editID) {
	document.getElementById(hiddenFieldID).style.display = 'block';
	document.getElementById(editID).style.display = 'none';
}

/**
 * cancelEditField() : hides the elements for editing a field (reverse action of editField )
 * @param existedID : the span that contains the existed value
 * @param fieldID : the field we want to make editable
 * @param saveID : the 'save' button id for show/hide
 * @param cancelID : the 'cancel' button id for show/hide
 * @param editID : the 'edit' button id for show/hide
 */
function cancelEditField (existedID, fieldID, saveID, editID ) {
	document.getElementById(existedID).style.display = 'inline-block';
    document.getElementById(fieldID).style.display = 'none';

    document.getElementById(saveID).className = 'submitButtonsHide';
    document.getElementById(editID).style.display = 'block';
    document.getElementById(editID).parentNode.parentNode.className = 'settingsElement' ;
}

/**
 * cancelEditHiddenField() : hides the elements for editing a field (reverse action of editHiddenField )
 * @param fieldID : the field we want to make editable
 * @param saveID : the 'save' button id for show/hide
 * @param cancelID : the 'cancel' button id for show/hide
 * @param editID : the 'edit' button id for show/hide
 */
function cancelEditHiddenField( hiddenFieldID, editID) {
	document.getElementById(hiddenFieldID).style.display = 'none';
	document.getElementById(editID).style.display = 'block';
}


/**
 * showSettingsTab() : show specific tab in settings page
 * @param tab : the specific tab to appear
 */
function showSettingsTab( tab ) {
	/* show specific tab content */
	document.getElementById('profileSettings').style.display = 'none';
	document.getElementById('accountSettings').style.display = 'none';
	document.getElementById(tab).style.display = 'block';

	/* change selected button */
	document.getElementById('profileSettingsTab').className="";
	document.getElementById('accountSettingsTab').className="";
	var d = document.getElementById(tab+'Tab')
	d.className= d.className + " active";

}

/**
 * setLeap() : called when year selected to set the number of days
 * @param year : the selected year
 */
function setLeap( year ) {
	console.log(year);

	if ( ( (year % 4 == 0) && (year % 100 != 0) ) || (year % 400 == 0) ){
		document.getElementById('m29').style.display = "none";
		document.getElementById('m30').style.display = "none";
		console.log('if');
	}
	else {
		document.getElementById('m29').style.display = "block";
		document.getElementById('m30').style.display = "block";
		console.log('else');

	}

}

/**
 * setSmall() : called when month selected to set the number of days
 * @param year : the selected year
 */
function setSmall( year ) {
	console.log(year + '- 31' );

	if ( ( (year % 4 == 0) && (year % 100 != 0) ) || (year % 400 == 0) ){
		document.getElementById('m31').style.display = "none";
		console.log('if-31');
	}
	else {
		document.getElementById('m31').style.display = "block";
		console.log('else-31');

	}

}

/********************************************/
/* 				PROFILE 					*/
/********************************************/

/**
 * number0to59() : checking values between 0-60 (i.e minutes)
 * @param input : the input
 */
function number0to59(input) {
    if (input.value < 0) input.value = 0;
    if (input.value > 59) input.value = 59;
    }

/**
 * number0to99() : checking values between 0-100 (i.e minutes)
 * @param input : the input
 */
function number0to99(input) {
    if (input.value < 0) input.value = 0;
    if (input.value > 99) input.value = 99;
  }








