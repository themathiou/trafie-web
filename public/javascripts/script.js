/********************************************/
/* 				SETTINGS 					*/
/********************************************/

/**
 * editAbstractField() : shows the elements for editing a field
 * @param form_node : the form with all the fields
 */
function editField( parent_node ) {
	var noneditables = parent_node.querySelectorAll('.non_editable');
	var editables = parent_node.querySelectorAll('.editable');

	for(var i=0, length=noneditables.length; i<length; i++) { noneditables[i].style.display = 'none'; }
	for(var i=0, length=editables.length; i<length; i++) { editables[i].style.display = 'block'; }
}

/**
 * cancelEditAbstractField() : hides the elements for editing a field (reverse action of editField )
 * @param existedID :
 */
function cancelEditField( parent_node ) {
	var noneditables = parent_node.querySelectorAll('.non_editable');
	var editables = parent_node.querySelectorAll('.editable');

	for(var i=0, length=noneditables.length; i<length; i++) { noneditables[i].style.display = 'inline-block'; }
	for(var i=0, length=editables.length; i<length; i++) { editables[i].style.display = 'none'; }
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
/**
 * ajax_get() : called for making GET ajax calls
 * @param url : the target url for the ajax call
 * @param callback : the callback function
 */
function ajax_get(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);

	xhr.addEventListener('load', function (e) {
	    callback( xhr.responseText );
	}, false);

	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.send();
}

/**
 * ajax_post() : called for making POST ajax calls
 * @param data : the data(parameters) we pass to the request
 * @param url : the target url for the ajax call
 * @param callback : the callback function
 */
function ajax_post(data, url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url);

	xhr.addEventListener('load', function (e) {
	    callback( xhr.responseText );
	}, false);

	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.send(data);
}

/**
 * ajax_put() : called for making PUT ajax calls
 * @param data : the data(parameters) we pass to the request
 * @param url : the target url for the ajax call
 * @param callback : the callback function
 */
function ajax_put(data, url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('PUT', url);



	xhr.addEventListener('load', function (e) {
		console.log(data);
	    callback( xhr.responseText );
	}, false);

	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.send(data);
}

/**
 * ajax_delete() : called for making DELETE ajax calls
 * @param url : the target url for the ajax call
 * @param callback : the callback function
 */
function ajax_delete( url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('DELETE', url);

	xhr.addEventListener('load', function (e) {
	    callback( xhr.status , xhr.responseText );
	}, false);

	xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.send();
}


/**
 * submit_form() : serialize the form and creates a json with "name":"value" combinations
 * @param form : the form we submit
 * @param callback : the callback function
 */
function submit_form(form, callback) {
	var data = '';
	//for-loop that reads the form elements and their values and creates the
	//"name":"value" combinations
	for( var i=0, length = form.elements.length; i < length; i++) {
		if ( form.elements.hasOwnProperty(i) ) {
			data += '\"'+form.elements[i].name + '\":\"' + form.elements[i].value + '\"';
		}

		if (i < length - 1) {
			data = data + ',';
		}
	}

	//add {} around the data
	data = '{' + data + '}';

	//get the method of the form
	var method = form.attributes.method.value;

	//case conditions for separating the method we use in the specific form
	// cases : POST - PUT -GET
	switch(method){
		case 'POST':
			ajax_post(data, form.attributes.action.value, callback);
			break;
		case 'PUT':
			ajax_put(data, form.attributes.action.value, callback);
			break;
		case 'GET' :
			console.log('-get?');
	}

}








