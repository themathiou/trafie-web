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
/* 				REST CALLS 					*/
/********************************************/

var xhr = new XMLHttpRequest();

function ajax_post(data, url, callback) {
	xhr.open('POST', url);

	xhr.addEventListener('load', function (e) {
	    callback( xhr.responseText );
	}, false);

	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.send(data);
}

function ajax_delete( url, callback) {
	xhr.open('DELETE', url);

	xhr.addEventListener('load', function (e) {
	    callback( xhr.status , xhr.responseText );
	}, false);

	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.send();
}

function submit_form(form, callback) {
	var data = '';
	for( var i=0, length = form.elements.length; i < length; i++) {
		if ( form.elements.hasOwnProperty(i) ) {
			data += '\"'+form.elements[i].name + '\":\"' + form.elements[i].value + '\"';
		}

		if (i < length - 1) {
			data = data + ',';
		}
	}

	data = '{' + data + '}';


	var method = form.attributes.method.value;
	switch(method){
		case 'POST':
			ajax_post(data, form.attributes.action.value, callback);
			break;
		case 'GET' :
			console.log('-get?');
	}

}








