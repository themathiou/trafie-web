/********************************************/
/* 				MAIN MENU 					*/
/********************************************/

function mainMenuHandlers(){

	//search field
	document.getElementById("search").onkeyup = function(){
		var search_text = this.value;

		if( search_text != '' ) {
			ajax_get_input_field('/search/?value='+this.value, this, function(res){
				var response = JSON.parse(res);

				if( response.length == 0 ) { //no results
					document.getElementById("search_results").style.display = 'none';
					// document.getElementById("search_results").innerHTML = '<li> no results found for \"'+ search_text +'\" </li>';
				} else if( response.length > 0 ){ //results
					var resultList = '';
					document.getElementById("search_results").style.display = 'block';
					for( i in response ) {
						if( response[i].username ) {
							resultList += '<li><a href="/'+response[i].username+'"><span class="name">'+response[i].first_name+'  '+response[i].last_name+'</span>  <span class="details">'+response[i].formatted_discipline+' '+response[i].formatted_country+'</span></a></li>';
						} else if( response[i]._id ) {
							resultList += '<li><a href="/'+response[i]._id+'"><span class="name">'+response[i].first_name+'  '+response[i].last_name+'</span>  <span class="details">'+response[i].formatted_discipline+' '+response[i].formatted_country+'</span></a></li>';
						}
					}
					document.getElementById("search_results").innerHTML = resultList;
				} else { //no results
					document.getElementById("search_results").style.display = 'none';
					// document.getElementById("search_results").innerHTML = '<li> no results found for \"'+ search_text +'\" </li>';
				}

			});
		} else {
			document.getElementById("search_results").style.display = 'none';
		}
	}

	/*
		document.getElementById("search").onblur = function(){
			document.getElementById("search_results").style.display = 'none';
		}
	*/
}

/********************************************/
/* 				UI ASSETS 					*/
/********************************************/

/**
 * startLoading() : show a loader
 * @param element : loading element
 */
// function startLoading( element ) {
//         document.getElementById( element ).style.display = 'block';
// }

/**
 * startLoading() : hides a loader after finish
 * @param element : loading element
 */
// function stopLoading( element ) {
//     document.getElementById( element ).style.display = 'none';
// }

/********************************************/
/* 				SETTINGS 					*/
/********************************************/

/**
 * editField() : shows the elements for editing a field
 * @param form_node : the form with all the fields
 */
// function editField( parent_node ) {
// 	parent_node.style.backgroundColor = '#F6F6F6';
// 	var noneditables = parent_node.querySelectorAll('.non_editable');
// 	var editables = parent_node.querySelectorAll('.editable');

// 	for(var i=0, length=noneditables.length; i<length; i++) { noneditables[i].style.display = 'none'; }
// 	for(var i=0, length=editables.length; i<length; i++) { editables[i].style.display = 'block'; }
// }

/**
 * cancelEditField() : hides the elements for editing a field (reverse action of editField )
 * @param existedID :
 */
// function cancelEditField( parent_node ) {
// 	parent_node.style.backgroundColor = 'white';
// 	var noneditables = parent_node.querySelectorAll('.non_editable');
// 	var editables = parent_node.querySelectorAll('.editable');

// 	for(var i=0, length=noneditables.length; i<length; i++) { noneditables[i].style.display = 'inline-block'; }
// 	for(var i=0, length=editables.length; i<length; i++) { editables[i].style.display = 'none'; }
// }




/**
 * setLeap() : called when year selected to set the number of days
 * @param year : the selected year
 */
// function setLeap( year ) {
// 	console.log(year);

// 	if ( ( (year % 4 == 0) && (year % 100 != 0) ) || (year % 400 == 0) ){
// 		document.getElementById('m29').style.display = "none";
// 		document.getElementById('m30').style.display = "none";
// 		console.log('if');
// 	}
// 	else {
// 		document.getElementById('m29').style.display = "block";
// 		document.getElementById('m30').style.display = "block";
// 		console.log('else');

// 	}

// }

/**
 * setSmall() : called when month selected to set the number of days
 * @param year : the selected year
 */
// function setSmall( year ) {
// 	console.log(year + '- 31' );

// 	if ( ( (year % 4 == 0) && (year % 100 != 0) ) || (year % 400 == 0) ){
// 		document.getElementById('m31').style.display = "none";
// 		console.log('if-31');
// 	}
// 	else {
// 		document.getElementById('m31').style.display = "block";
// 		console.log('else-31');

// 	}

// }

/********************************************/
/* 				REST CALLS 					*/
/********************************************/
/**
 * ajax_get() : called for making GET ajax calls
 * @param url : the target url for the ajax call
 * @param loading_element : the loading element in page
 * @param callback : the callback function
 */
// function ajax_get(url, loading_element, callback) {
// 	if( loading_element )  startLoading( loading_element ); 
		 
// 	var xhr = new XMLHttpRequest();
// 	xhr.open('GET', url);

// 	xhr.addEventListener('load', function (e) {
// 	    callback( xhr.responseText );
// 	}, false);

// 	xhr.setRequestHeader('Content-Type', 'application/json');
// 	xhr.onreadystatechange = function () {
//         if (xhr.readyState == 4 && xhr.status == 200) {
//         	if( loading_element ) stopLoading( loading_element );
//         }
//     }

// 	xhr.send();
// }

/**
 * ajax_get_input_field() : called for making GET ajax calls. 
 * SAME AS GET BUT loader is in the input field
 * @param url : the target url for the ajax call
 * @param callback : the callback function
 */
// function ajax_get_input_field(url, input_element, callback) {
// 	console.log(input_element);
// 	input_element.setAttribute("class","loading");

// 	var xhr = new XMLHttpRequest();
// 	xhr.open('GET', url);

// 	xhr.addEventListener('load', function (e) {
// 	    callback( xhr.responseText );
// 	}, false);

// 	xhr.setRequestHeader('Content-Type', 'application/json');
// 	xhr.onreadystatechange = function () {
//         if (xhr.readyState == 4 && xhr.status == 200) {
      
//         }
//     }

// 	xhr.send();
// }


/**
 * ajax_post() : called for making POST ajax calls
 * @param data : the data(parameters) we pass to the request
 * @param url : the target url for the ajax call
 * @param loading_element : the loading element in page
 * @param callback : the callback function
 */
// function ajax_post(data, url, loading_element, callback) {
// 	startLoading( loading_element );
// 	var xhr = new XMLHttpRequest();
// 	xhr.open('POST', url);

// 	xhr.addEventListener('load', function (e) {
// 	    callback( xhr.responseText );
// 	}, false);

// 	xhr.setRequestHeader('Content-Type', 'application/json');
// 	xhr.onreadystatechange = function () {
//         if (xhr.readyState == 4 && xhr.status == 201) {
//             stopLoading( loading_element );
//         }
//     }

// 	xhr.send(data);
// }

/**
 * ajax_put() : called for making PUT ajax calls
 * @param data : the data(parameters) we pass to the request
 * @param url : the target url for the ajax call
 * @param loading_element : the loading element in page
 * @param callback : the callback function
 */
// function ajax_put(data, url, loading_element, callback) {
// 	startLoading( loading_element );
// 	var xhr = new XMLHttpRequest();
// 	xhr.open('PUT', url);

// 	xhr.addEventListener('load', function (e) {
// 		console.log(data);
// 	    callback( xhr.responseText );
// 	}, false);

// 	xhr.setRequestHeader('Content-Type', 'application/json');
// 	xhr.onreadystatechange = function () {
//         if (xhr.readyState == 4 && xhr.status == 200) {
//             stopLoading( loading_element );
//         }
//     }

// 	xhr.send(data);
// }

/**
 * ajax_delete() : called for making DELETE ajax calls
 * @param url : the target url for the ajax call
 * @param loading_element : the loading element in page
 * @param callback : the callback function
 */
// function ajax_delete( url, loading_element, callback) {

// 	startLoading( loading_element );

// 	var xhr = new XMLHttpRequest();
// 	xhr.open('DELETE', url);

// 	xhr.addEventListener('load', function (e) {
// 	    callback( xhr.status , xhr.responseText );
// 	}, false);

// 	xhr.setRequestHeader('Content-Type', 'application/json');
// 	xhr.onreadystatechange = function () {
//         if (xhr.readyState == 4 && xhr.status == 200) {
//             stopLoading( loading_element );
//         }
//     }

// 	xhr.send();
// }


/**
 * submit_form() : serialize the form and creates a json with "name":"value" combinations
 * @param form : the form we submit
 * @param callback : the callback function
 */
// function submit_form(form, callback) {
// 	var data = '';
// 	//for-loop that reads the form elements and their values and creates the
// 	//"name":"value" combinations
// 	for( var i=0, length = form.elements.length; i < length; i++) {
// 		if ( form.elements.hasOwnProperty(i) ) {
// 			data += '\"'+form.elements[i].name + '\":\"' + form.elements[i].value + '\"';
// 		}

// 		if (i < length - 1) {
// 			data = data + ',';
// 		}
// 	}

// 	//add {} around the data
// 	data = '{' + data + '}';

// 	//get the method of the form
// 	var method = form.attributes.method.value;

// 	//case conditions for separating the method we use in the specific form
// 	// cases : POST - PUT -GET
// 	switch(method){
// 		case 'POST':
// 			ajax_post(data, form.attributes.action.value, "loading", callback);
// 			break;
// 		case 'PUT':
// 			ajax_put(data, form.attributes.action.value, "loading", callback);
// 			break;
// 		case 'GET' :
// 			console.log('-get?');
// 	}

// }






