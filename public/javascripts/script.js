/********************************************/
/* 				SETTINGS 					*/
/********************************************/

/**
 * editField() : shows the elements for editing a field
 * @param fieldID : the field we want to make editable
 * @param saveID : the 'save' button id for show/hide
 * @param cancelID : the 'cancel' button id for show/hide
 * @param editID : the 'edit' button id for show/hide
 */
function editField( fieldID, divID, editID ) {
    document.getElementById(fieldID).disabled = false;
    document.getElementById(divID).style.display = 'block';
    document.getElementById(editID).style.display = 'none';
    document.getElementById(editID).parentNode.parentNode.className = 'settingsElement editable' ;
}

/**
 * cancelEditField() : hides the elements for editing a field (reverse action of editField )
 * @param fieldID : the field we want to make editable
 * @param saveID : the 'save' button id for show/hide
 * @param cancelID : the 'cancel' button id for show/hide
 * @param editID : the 'edit' button id for show/hide
 */
function cancelEditField (fieldID_shadow, fieldID, divID, editID ) {
    document.getElementById(fieldID).value = document.getElementById(fieldID_shadow).value;
    document.getElementById(fieldID).disabled = true;
    document.getElementById(divID).style.display = 'none';
    document.getElementById(editID).style.display = 'block';
    document.getElementById(editID).parentNode.parentNode.className = 'settingsElement' ;
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

/********************************************/
/* 				PROFILE 					*/
/********************************************/

/**
 * open_new_activity_form() : shows the elements of 'create a new activity' form
 */
function open_new_activity_form() {

	/* document.getElementById('add_activity_link').style.display = 'none';
	document.getElementById('cancel_activity_link').style.display = 'block';
	document.getElementById('add_activity_form').style.display = 'block'; */

    var minheight = 20;
	var maxheight = 60;
	var time = 500;
	var timer = null;
	var toggled = false;

	document.getElementById('add_activity_link').removeAttribute("onClick");
	document.getElementById('add_activity_link').removeAttribute("href");

	var controler = document.getElementById('add_activity_link');
	var slider = document.getElementById('slider');
	slider.style.height = minheight + 'px';

	clearInterval(timer);
	var instanceheight = parseInt(slider.style.height);
	var init = (new Date()).getTime();
	var height = (toggled = !toggled) ? maxheight : minheight;

	console.log('@open - ' + toggled);

	var disp = height - parseInt(slider.style.height);
	timer = setInterval(function()
	{
	  var instance = (new Date()).getTime() - init;
	  if(instance < time ) {
	    var pos = Math.floor(disp * instance / time);
	    result = instanceheight + pos;
	    slider.style.height =  result + 'px';
/* 	    document.getElementById('log').innerHTML = 'Current Height : <b>' + result + '</b><br /> Current Time : <b>' + instance + '</b>'; */
	  }else {
	    slider.style.height = height + 'px'; //safety side ^^
	    clearInterval(timer);
	    controler.value = toggled ? ' Slide Up ' :' Slide Down ';
/* 	    document.getElementById('log').innerHTML = 'Current Height : <b>' + height + '</b><br /> Current Time : <b>' + time + '</b>'; */
	  }
	},1);


}

/**
 * close_new_activity_form() : hides the elements of 'create a new activity' form
 */
function close_new_activity_form() {
    /*document.getElementById('add_activity_link').style.display = 'block';
    document.getElementById('cancel_activity_link').style.display = 'none';
    document.getElementById('add_activity_form').style.display = 'none';*/

    var minheight = 20;
	var maxheight = 100;
	var time = 300;
	var timer = null;
	var toggled = true;

	var controler = document.getElementById('cancel_activity_link');
    var slider = document.getElementById('slider');

	clearInterval(timer);
	var instanceheight = parseInt(slider.style.height);
	var init = ( new Date() ).getTime();
	var height = (toggled = !toggled) ? maxheight : minheight;

	console.log('@close - ' + toggled);

	var disp = height - parseInt(slider.style.height);
	timer = setInterval(function()
	{
	  var instance = ( new Date() ).getTime() - init;
	  if( instance < time ) {
	    var pos = Math.floor(disp * instance / time);
	    result = instanceheight + pos;
	    slider.style.height =  result + 'px';
	  } else {
	    slider.style.height = height + 'px'; //safety side ^^
	    clearInterval(timer);
	    controler.value = toggled ? ' Slide Down ' :' Slide Up ';
		}
	},1);


	document.getElementById('add_activity_link').setAttribute("onClick","open_new_activity_form();");
	document.getElementById('add_activity_link').setAttribute("href","javascript:;");
	document.getElementById('discipline_input').selectedIndex = 0;
    document.getElementById('time_activity').style.display = 'none';
    document.getElementById('distance_activity').style.display = 'none';
    document.getElementById('point_activity').style.display = 'none';
    document.getElementById('submit_buttons').style.display = 'none';


}

/**
 * show_specific_form() : shows specific elements on 'create a new activity' form, based on selected discipline
 * @param choice : user's choice of discipline
 */
function show_specific_form(choice) {
    var distance = ['high_jump','long_jump','triple_jump', 'pole_vault', 'shot_put', 'discus', 'hammer', 'javelin'];
    var time = ['100m', '200m', '400m', '800m', '1500m', '3000m', '60m_hurdles', '100m_hurdles', '110m_hurdles', '400m_hurdles', '3000m_steeple', '4x100m_relay', '4x400m_relay', 'marathon'];
    var points = ['pentathlon', 'heptathlon', 'decathlon'];

    console.log('Choice: ' + choice.value);

    if( distance.indexOf(choice.value) > -1 ) {
        document.getElementById('submit_buttons').style.display = 'block';

        document.getElementById('slider').style.height = '210px';
        document.getElementById('time_activity').style.display = 'none';
        document.getElementById('distance_activity').style.display = 'block';
        document.getElementById('point_activity').style.display = 'none';

    }
    else if ( time.indexOf(choice.value) > -1 ) {
        document.getElementById('submit_buttons').style.display = 'block';

        document.getElementById('slider').style.height = '210px';
        document.getElementById('time_activity').style.display = 'block';
        document.getElementById('distance_activity').style.display = 'none';
        document.getElementById('point_activity').style.display = 'none';
    }
    else if ( points.indexOf(choice.value) > -1 ) {
        document.getElementById('submit_buttons').style.display = 'block';

        document.getElementById('slider').style.height = '210px';
        document.getElementById('time_activity').style.display = 'none';
        document.getElementById('distance_activity').style.display = 'none';
        document.getElementById('point_activity').style.display = 'block';
    }
    else{
        document.getElementById('submit_buttons').style.display = 'none';

        document.getElementById('slider').style.height = '60px';
        document.getElementById('time_activity').style.display = 'none';
        document.getElementById('distance_activity').style.display = 'none';
        document.getElementById('point_activity').style.display = 'none';
    }
}

//function for checking values between 0-60 (i.e minutes)
function number0to59(input) {
    if (input.value < 0) input.value = 0;
    if (input.value > 59) input.value = 59;
    }

//function for checking values between 0-100 (i.e centimeters)
function number0to99(input) {
    if (input.value < 0) input.value = 0;
    if (input.value > 99) input.value = 99;
  }




