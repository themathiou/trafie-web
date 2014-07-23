

/********************************************/
/* 				EVENTS HANDLERS				*/
/********************************************/

/**
 * number0to59() : checking values between 0-60 (i.e minutes)
 * @param input : the input
 */
// function number0to59(input) {
//     if (input.value < 0) input.value = 0;
//     if (input.value > 59) input.value = 59;
//     }

/**
 * number0to99() : checking values between 0-100 (i.e minutes)
 * @param input : the input
 */
// function number0to99(input) {
//     if (input.value < 0) input.value = 0;
//     if (input.value > 99) input.value = 99;
//   }

/**
 * show_specific_form() : shows specific elements on 'create a new activity' form, based on selected discipline
 * @param choice : user's choice of discipline
 */
// function show_specific_form(choice) {
//     var distance = ['high_jump','long_jump','triple_jump', 'pole_vault', 'shot_put', 'discus', 'hammer', 'javelin'];
//     var time = ['100m', '200m', '400m', '800m', '1500m', '3000m', '60m_hurdles', '100m_hurdles', '110m_hurdles', '400m_hurdles', '3000m_steeple', '4x100m_relay', '4x400m_relay', 'marathon'];
//     var points = ['pentathlon', 'heptathlon', 'decathlon'];

//     if( distance.indexOf(choice.value) > -1 ) {
//         document.getElementById('submit_buttons').style.display = 'block';

//         document.getElementById('slider').style.height = '210px';
//         document.getElementById('add_time_activity_form').style.display = 'none';
//         document.getElementById('add_distance_activity_form').style.display = 'block';
//         document.getElementById('add_points_activity_form').style.display = 'none';

//     }
//     else if ( time.indexOf(choice.value) > -1 ) {
//         document.getElementById('submit_buttons').style.display = 'block';

//         document.getElementById('slider').style.height = '210px';
//         document.getElementById('add_time_activity_form').style.display = 'block';
//         document.getElementById('add_distance_activity_form').style.display = 'none';
//         document.getElementById('add_points_activity_form').style.display = 'none';
//     }
//     else if ( points.indexOf(choice.value) > -1 ) {
//         document.getElementById('submit_buttons').style.display = 'block';

//         document.getElementById('slider').style.height = '210px';
//         document.getElementById('add_time_activity_form').style.display = 'none';
//         document.getElementById('add_distance_activity_form').style.display = 'none';
//         document.getElementById('add_points_activity_form').style.display = 'block';
//     }
//     else{
//         document.getElementById('submit_buttons').style.display = 'none';

//         document.getElementById('slider').style.height = '60px';
//         document.getElementById('add_time_activity_form').style.display = 'none';
//         document.getElementById('add_distance_activity_form').style.display = 'none';
//         document.getElementById('add_points_activity_form').style.display = 'none';
//     }
// }

/**
 * open_new_activity_form() : shows the elements of 'create a new activity' form
 */
// function open_new_activity_form() {

// 	/* document.getElementById('add_activity_link').style.display = 'none';
// 	document.getElementById('cancel_activity_link').style.display = 'block';
// 	document.getElementById('add_activity_form').style.display = 'block'; */

//     var minheight = 20;
// 	var maxheight = 210;
// 	var time = 300;
// 	var timer = null;
// 	var toggled = false;

// 	document.getElementById('add_activity_link').removeAttribute("onClick");
// 	document.getElementById('add_activity_link').removeAttribute("href");

// 	var controler = document.getElementById('add_activity_link');
// 	var slider = document.getElementById('slider');
// 	slider.style.height = minheight + 'px';

// 	clearInterval(timer);
// 	var instanceheight = parseInt(slider.style.height);
// 	var init = (new Date()).getTime();
// 	var height = (toggled = !toggled) ? maxheight : minheight;

// 	var disp = height - parseInt(slider.style.height);
// 	timer = setInterval(function()
// 	{
// 	  var instance = (new Date()).getTime() - init;
// 	  if(instance < time ) {
// 	    var pos = Math.floor(disp * instance / time);
// 	    result = instanceheight + pos;
// 	    slider.style.height =  result + 'px';
// /* 	    document.getElementById('log').innerHTML = 'Current Height : <b>' + result + '</b><br /> Current Time : <b>' + instance + '</b>'; */
// 	  }else {
// 	    slider.style.height = height + 'px'; //safety side ^^
// 	    clearInterval(timer);
// 	    controler.value = toggled ? ' Slide Up ' :' Slide Down ';
// /* 	    document.getElementById('log').innerHTML = 'Current Height : <b>' + height + '</b><br /> Current Time : <b>' + time + '</b>'; */
// 	  }
// 	},1);

// 	document.getElementById('add_activity_link').setAttribute("onClick","close_new_activity_form();");
// 	document.getElementById('add_activity_link').setAttribute("href","javascript:;");

// }

/**
 * close_new_activity_form() : hides the elements of 'create a new activity' form
 */
// function close_new_activity_form() {
//     /*document.getElementById('add_activity_link').style.display = 'block';
//     document.getElementById('cancel_activity_link').style.display = 'none';
//     document.getElementById('add_activity_form').style.display = 'none';*/

//     var minheight = 20;
// 	var maxheight = 100;
// 	var time = 200;
// 	var timer = null;
// 	var toggled = true;

// 	var controler = document.getElementById('cancel_activity_link');
//     var slider = document.getElementById('slider');

// 	clearInterval(timer);
// 	var instanceheight = parseInt(slider.style.height);
// 	var init = ( new Date() ).getTime();
// 	var height = (toggled = !toggled) ? maxheight : minheight;

// 	var disp = height - parseInt(slider.style.height);
// 	timer = setInterval(function()
// 	{
// 	  var instance = ( new Date() ).getTime() - init;
// 	  if( instance < time ) {
// 	    var pos = Math.floor(disp * instance / time);
// 	    result = instanceheight + pos;
// 	    slider.style.height =  result + 'px';
// 	  } else {
// 	    slider.style.height = height + 'px'; //safety side ^^
// 	    clearInterval(timer);
// 	    controler.value = toggled ? ' Slide Down ' :' Slide Up ';
// 		}
// 	},1);


// 	document.getElementById('add_activity_link').setAttribute("onClick","open_new_activity_form();");
// 	document.getElementById('add_activity_link').setAttribute("href","javascript:;");

// }

/**
 * profileHandlers() : handlers in profile page
 */
function profileHandlers() {

	// Handlers defined as variables in order to be called in for loop for different elements
	// Delete handler is used to delete each activity
	// var delete_handler = function(e) {
	// 	//prevent default behavior of page redirection. We want to stay in the same page.
	// 	var evt = e ? e : window.event;
	// 	if (evt.preventDefault) evt.preventDefault();

	// 	var r = confirm(" Are you sure you want to delete this activity? ");
	// 	if (r==true)
	// 	{
	// 		var that = this;
	// 		//delete activity with ajax call.
	// 		ajax_delete(this.getAttribute('href'), 'loading', function(res_status, res_text){
	// 			//success case
	// 			if(res_status == 200) {
	// 				var grandparent = that.parentNode.parentNode;
	// 				grandparent.parentNode.removeChild(grandparent);
	// 			}
	// 			//error case
	// 			else {
	// 				alert('You can\'t delete this activity');
	// 			}
	// 		});
	// 	} else {
	// 		this.parentNode.parentNode.style.border = '1px solid white';
	// 	}
	// }

	// Edit handler is used to transform activities to aditable with existed values in fields
	// var edit_handler = function() {
	// 	//color the border of the editable box
	// 	this.parentNode.style.border = '1px solid #F4B510';

	// 	var parent = this.parentNode;
	// 	//take the existed activity element in order to get the existed values and put them in editable fields
	// 	var existed_activity = parent.querySelector('.current_data');
	// 	//hide existed activity
	// 	existed_activity.style.display = 'none';


	// 	var this_discipline = existed_activity.querySelector('.discipline').getAttribute('data-value');
	// 	var this_performance = existed_activity.querySelector('.performance').getAttribute('data-value');
	// 	//"2014-03-14T01:00:00.000Z" -> split in T and remove the first \"
	// 	var this_date = existed_activity.querySelector('.date').getAttribute('data-value').split('T')[0].split('\"')[1];
	// 		//distance disciplines
	// 		if( disciplines.distance.indexOf(this_discipline) > -1 ) {

	// 			//get and clone activity template
	// 			var p = document.getElementById("editDistanceActivityTemplate");
	// 			var edit_activity = p.cloneNode(true);
	// 			//set action to edit activity button
	// 			edit_activity.querySelector('#edit_activity_form').setAttribute('action', edit_activity.querySelector('#edit_activity_form').getAttribute('action') + parent.getAttribute('data-activity-id').replace(/\"/g, '') );
	// 			//show editable activities
	// 			edit_activity.style.display = 'block' ;

	// 			console.log(this_date);

	// 			//date picker for editable field
	// 			var date_picker = new Pikaday({field: edit_activity.querySelector('#edit_datepicker'), firstDay: 1, minDate: new Date('2000-01-01'), maxDate: new Date(), yearRange: [2000,2020], defaultDate: new Date(this_date), setDefaultDate: new Date(this_date)});

	// 			//include the edit activity in the parent div
	// 			this.parentNode.appendChild(edit_activity);

	// 			//@variable temp_m we divided performance with 10000. i.e (hj:2.23) 23300/10000 = 2.3300
	// 			var temp_m = parseInt(this_performance/10000);
	// 			//@variable temp_cm we get the modulo of (performance/10000) and temp_m * 100.
	// 			//i.e we get the .23 of 2.23 in hj
	// 			var temp_cm = parseInt(((this_performance/10000)%temp_m) * 100);

	// 			//add existed values in editable fields
	// 			edit_activity.querySelector('#distance_1_input').value = temp_m;
	// 			edit_activity.querySelector('#distance_2_input').value = temp_cm;

	// 			//handler for cancel button
	// 			edit_activity.querySelector('.cancel_edit_activity').onclick = function() {
	// 				edit_activity.parentNode.style.border = '1px solid white';
	// 				var grandparent = this.parentNode.parentNode;
	// 				grandparent.parentNode.removeChild(grandparent);
	// 				edit_activity.style.display = 'none' ;
	// 				existed_activity.style.display = 'block';
	// 			}

	// 			//handler for submiting the editable forms
	// 			edit_activity.querySelector('#edit_activity_form').onsubmit = function (e) {
	// 				var evt = e ? e : window.event;
	// 				if (evt.preventDefault) evt.preventDefault();

	// 				//call submit_form() function (defined in script.js) and passing the response
	// 				//in order to show the updated activity
	// 				submit_form(this, function(response){
	// 					if(response!='null') {
	// 						var res = JSON.parse(response);
	// 						edit_activity.style.display = 'none' ;
	// 						edit_activity.parentNode.style.border = '1px solid white';

	// 						existed_activity.style.display = 'block';
	// 						existed_activity.querySelector('.performance').innerHTML = res.formatted_performance;
	// 						existed_activity.querySelector('.discipline').innerHTML = res.formatted_discipline;
	// 						existed_activity.querySelector('.date').innerHTML = res.formatted_date;

	// 						existed_activity.querySelector('.performance').setAttribute('data-value', res.performance);


	// 					} else {
	// 						alert('something went wrong. Please try again');
	// 					}

	// 				});
	// 			}


	// 		}
	// 		//time disciplines
	// 		if( disciplines.time.indexOf(this_discipline) > -1 ) {
	// 			//get template for time activity and clone it
	// 			var p = document.getElementById("editTimeActivityTemplate");
	// 			var edit_activity = p.cloneNode(true);
	// 			//set action attributes for the edit-activity-form
	// 			edit_activity.querySelector('#edit_activity_form').setAttribute('action', edit_activity.querySelector('#edit_activity_form').getAttribute('action') + parent.getAttribute('data-activity-id').replace(/\"/g, '') );
	// 			//show the edit-activity-form
	// 			edit_activity.style.display = 'block' ;

	// 			//date picker for editable field
	// 			var date_picker = new Pikaday({field: edit_activity.querySelector('#edit_datepicker'), firstDay: 1, minDate: new Date('2000-01-01'), maxDate: new Date(), yearRange: [2000,2020]});


	// 			this.parentNode.appendChild(edit_activity);

	// 			//we get the existed performance in hh:mm:ss.cc format.
	// 			//We split it and add each part to the specific element
	// 			edit_activity.querySelector('#hours_input').value = this_performance.split(':')[0];
	// 			edit_activity.querySelector('#minutes_input').value = this_performance.split(':')[1];
	// 			edit_activity.querySelector('#seconds_input').value = this_performance.split(':')[2].split('.')[0];
	// 			edit_activity.querySelector('#centiseconds_input').value = this_performance.split(':')[2].split('.')[1];

	// 			//add handler to cancel activity button
	// 			edit_activity.querySelector('.cancel_edit_activity').onclick = function() {
	// 				edit_activity.parentNode.style.border = '1px solid white';
	// 				var grandparent = this.parentNode.parentNode;
	// 				grandparent.parentNode.removeChild(grandparent);
	// 				edit_activity.style.display = 'none' ;
	// 				existed_activity.style.display = 'block';
	// 			}

	// 			//add handler for submiting the edit-activity-form
	// 			edit_activity.querySelector('#edit_activity_form').onsubmit = function (e) {
	// 				var evt = e ? e : window.event;
	// 				if (evt.preventDefault) evt.preventDefault();

	// 				//call the submit_form function(defined in script.js) and we get the response
	// 				//in order to update the existed activity
	// 				submit_form(this, function(response){
	// 					if(response!='null') {
	// 						var res = JSON.parse(response);
	// 						edit_activity.style.display = 'none' ;
	// 						edit_activity.parentNode.style.border = '1px solid white';

	// 						existed_activity.style.display = 'block';
	// 						existed_activity.querySelector('.performance').innerHTML = res.formatted_performance;
	// 						existed_activity.querySelector('.discipline').innerHTML = res.formatted_discipline;
	// 						existed_activity.querySelector('.date').innerHTML = res.formatted_date;

	// 						existed_activity.querySelector('.performance').setAttribute('data-value', res.performance);


	// 					} else {
	// 						alert('something went wrong. Please try again');
	// 						close_new_activity_form();
	// 					}

	// 				});
	// 			}

	// 		}
	//     	//points disciplines
	//     	if( disciplines.points.indexOf(this_discipline) > -1 ) {
	//     		//get template for points activity and clone it
	// 			var p = document.getElementById("editPointsActivityTemplate");
	// 			var edit_activity = p.cloneNode(true);
	// 			//set action attributes for the edit-activity-form
	// 			edit_activity.querySelector('#edit_activity_form').setAttribute('action', edit_activity.querySelector('#edit_activity_form').getAttribute('action') + parent.getAttribute('data-activity-id').replace(/\"/g, '') );
	// 			//show the edit-activity-form
	// 			edit_activity.style.display = 'block' ;

	// 			//date picker for editable field
	// 			var date_picker = new Pikaday({field: edit_activity.querySelector('#edit_datepicker'), firstDay: 1, minDate: new Date('2000-01-01'), maxDate: new Date(), yearRange: [2000,2020]});

	// 			this.parentNode.appendChild(edit_activity);

	// 			//we get the existed performance and add it to the specific element
	// 			edit_activity.querySelector('#points_input').value = this_performance;

	// 			//add handler to cancel activity button
	// 			edit_activity.querySelector('.cancel_edit_activity').onclick = function() {
	// 				edit_activity.parentNode.style.border = '1px solid white';
	// 				var grandparent = this.parentNode.parentNode;
	// 				grandparent.parentNode.removeChild(grandparent);
	// 				edit_activity.style.display = 'none' ;
	// 				existed_activity.style.display = 'block';
	// 			}

	// 			//add handler for submiting the edit-activity-form
	// 			edit_activity.querySelector('#edit_activity_form').onsubmit = function (e) {
	// 				var evt = e ? e : window.event;
	// 				if (evt.preventDefault) evt.preventDefault();

	// 				//call the submit_form function(defined in script.js) and we get the response
	// 				//in order to update the existed activity
	// 				submit_form(this, function(response){
	// 					if(response!='null') {
	// 						var res = JSON.parse(response);
	// 						edit_activity.style.display = 'none' ;
	// 						edit_activity.parentNode.style.border = '1px solid white';

	// 						existed_activity.style.display = 'block';
	// 						existed_activity.querySelector('.performance').innerHTML = res.formatted_performance;
	// 						existed_activity.querySelector('.discipline').innerHTML = res.formatted_discipline;
	// 						existed_activity.querySelector('.date').innerHTML = res.formatted_date;

	// 						existed_activity.querySelector('.performance').setAttribute('data-value', res.performance);


	// 					} else {
	// 						alert('something went wrong. Please try again');
	// 						close_new_activity_form();
	// 					}

	// 				});
	// 			}

	// 		a}

	// 	this.onclick = function() {
	// 		this.parentNode.style.border = '1px solid white';
	// 		edit_activity.style.display = 'none' ;
	// 		existed_activity.style.display = 'block';

	// 		this.onclick = edit_handler;
	// 	}

	// }


	// // ATTACH HANDLERS
	// // Handler for add activity link. calls function to OPEN the slider for adding activity
	// document.getElementById("add_activity_link").onclick = function() {
	// 	open_new_activity_form();
	// }

	// // Handler for cancel adding activity link. calls function to CLOSE the slider for adding activity
	// var cancelAddActivityLinks = document.getElementsByClassName('cancel_link');
	// for( var i in cancelAddActivityLinks ) {
	// 	cancelAddActivityLinks[i].onclick = function() {
	// 		close_new_activity_form();
	// 	}
	// }


	// Handler for option-list with different disciplines in add activity.
	// document.getElementById("discipline_input").onchange = function() {
	// 	var disciplines_in_activity_forms = document.getElementsByClassName('new_activity_discipline');
	// 	for( var i=0, length=disciplines_in_activity_forms.length; i<length; i++) {
	// 		disciplines_in_activity_forms[i].setAttribute( 'value', this.value );
	// 	}
	// 	show_specific_form(this);
	// }

	// Handlers to limit time values in expected values. Use number0to59() and number0to99() functions
	document.getElementById("hours_input").onkeyup = function() {
		number0to59(this);
	}
	document.getElementById("minutes_input").onkeyup = function() {
		number0to59(this);
	}
	document.getElementById("seconds_input").onkeyup = function() {
		number0to59(this);
	}
	document.getElementById("centiseconds_input").onkeyup = function() {
		number0to99(this);
	}

	// Handlers to limit distance values in expected values. Use number0to99()
	document.getElementById("distance_2_input").onkeyup = function() {
		number0to99(this);
	}

	// ADD activity forms handlers. Three different handlers for the three different cases
	// Handler for time activity
	// document.getElementById("add_time_activity_form").onsubmit = function (e) {
	// 	var evt = e ? e : window.event;
	// 	if (evt.preventDefault) evt.preventDefault();

	// 	submit_form(this, function(response){
	// 		if(response!='null') {
	// 			var p = document.getElementById("newActivityTemplate");
	// 			var new_activity = p.cloneNode(true);

	// 			//make response object
	// 			var res = JSON.parse(response);

	// 			new_activity.style.display = 'block';
	// 			new_activity.removeAttribute('id');
	// 			new_activity.children[2].setAttribute('data-activity-id', res._id.replace(/\"/g, '') );
	// 			new_activity.children[2].children[0].children[0].setAttribute('href', new_activity.children[2].children[0].children[0].getAttribute('href') + res._id.replace(/\"/g, '') );
	// 			new_activity.children[2].children[0].children[0].onclick = delete_handler;
	// 			new_activity.children[2].children[0].children[1].innerHTML = res.formatted_performance;
	// 			new_activity.children[2].children[0].children[2].innerHTML = res.formatted_discipline;
	// 			new_activity.children[2].children[0].children[3].innerHTML = res.formatted_date;
	// 			new_activity.children[2].children[1].onclick = edit_handler;

	// 			var list = document.getElementById('history_line');

	// 			list.insertBefore( new_activity, list.firstChild.nextSibling );
	// 			close_new_activity_form();

	// 		} else {
	// 			alert('something went wrong. Please try again');
	// 			close_new_activity_form();
	// 		}

	// 	});
	// }
	// // Handler for distance activity
	// document.getElementById("add_distance_activity_form").onsubmit = function (e) {
	// 	var evt = e ? e : window.event;
	// 	if (evt.preventDefault) evt.preventDefault();

	// 	submit_form(this, function(response){
	// 		if(response!='null') {
	// 			var p = document.getElementById("newActivityTemplate");
	// 			var new_activity = p.cloneNode(true);

	// 			//make response object
	// 			var res = JSON.parse(response);

	// 			new_activity.style.display = 'block';
	// 			new_activity.removeAttribute('id');
	// 			new_activity.children[2].setAttribute('data-activity-id', res._id.replace(/\"/g, '') );
	// 			new_activity.children[2].children[0].children[0].setAttribute('href', new_activity.children[2].children[0].children[0].getAttribute('href') + res._id.replace(/\"/g, '') );
	// 			new_activity.children[2].children[0].children[0].onclick = delete_handler;
	// 			new_activity.children[2].children[0].children[1].innerHTML = res.formatted_performance;
	// 			new_activity.children[2].children[0].children[1].setAttribute('data-value', res.performance);
	// 			new_activity.children[2].children[0].children[2].innerHTML = res.formatted_discipline;
	// 			new_activity.children[2].children[0].children[2].setAttribute('data-value', res.discipline);
	// 			new_activity.children[2].children[0].children[3].innerHTML = res.formatted_date;
	// 			new_activity.children[2].children[0].children[3].setAttribute('data-value',res.date );
	// 			new_activity.children[2].children[1].onclick = edit_handler;

	// 			var list = document.getElementById('history_line');

	// 			list.insertBefore( new_activity, list.firstChild.nextSibling );
	// 			close_new_activity_form();

	// 		} else {
	// 			alert('something went wrong. Please try again');
	// 			close_new_activity_form();
	// 		}

	// 	});
	// }
	// // Handler for point activity
	// document.getElementById("add_points_activity_form").onsubmit = function (e) {
	// 	var evt = e ? e : window.event;
	// 	if (evt.preventDefault) evt.preventDefault();

	// 	submit_form(this, function(response){
	// 		if(response!='null') {
	// 			var p = document.getElementById("newActivityTemplate");
	// 			var new_activity = p.cloneNode(true);

	// 			//make response object
	// 			var res = JSON.parse(response);

	// 			new_activity.style.display = 'block';
	// 			new_activity.removeAttribute('id');
	// 			new_activity.children[2].setAttribute('data-activity-id', res._id.replace(/\"/g, '') );
	// 			new_activity.children[2].children[0].children[0].setAttribute('href', new_activity.children[2].children[0].children[0].getAttribute('href') + res._id.replace(/\"/g, '') );
	// 			new_activity.children[2].children[0].children[0].onclick = delete_handler;
	// 			new_activity.children[2].children[0].children[1].innerHTML = res.formatted_performance;
	// 			new_activity.children[2].children[0].children[2].innerHTML = res.formatted_discipline;
	// 			new_activity.children[2].children[0].children[3].innerHTML = res.formatted_date;
	// 			new_activity.children[2].children[1].onclick = edit_handler;

	// 			var list = document.getElementById('history_line');

	// 			list.insertBefore( new_activity, list.firstChild.nextSibling );
	// 			close_new_activity_form();

	// 		} else {
	// 			alert('something went wrong. Please try again');
	// 			close_new_activity_form();
	// 		}

	// 	});
	// }

	// // DELETE activity links
	// var deleteLinks = document.getElementsByClassName('deleteActivity');
	// for (var i in deleteLinks) {
	// 	deleteLinks[i].onclick  = delete_handler;
	// }

	// // EDIT activity links
	// var editLinks = document.getElementsByClassName('editActivity');
	// for (var i in editLinks) {
	// 	editLinks[i].onclick  = edit_handler;
	// }

}


