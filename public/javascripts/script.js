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
function editField( fieldID, saveID, cancelID, editID ) {
    document.getElementById(fieldID).disabled = false;
    document.getElementById(saveID).style.display = 'block';
    document.getElementById(cancelID).style.display = 'block';
    document.getElementById(editID).style.display = 'none';
}

/**
 * cancelEditField() : hides the elements for editing a field (reverse action of editField )
 * @param fieldID : the field we want to make editable
 * @param saveID : the 'save' button id for show/hide
 * @param cancelID : the 'cancel' button id for show/hide
 * @param editID : the 'edit' button id for show/hide
 */
function cancelEditField (fieldID_shadow, fieldID, saveID, cancelID, editID ) {
    document.getElementById(fieldID).value = document.getElementById(fieldID_shadow).value;
    document.getElementById(fieldID).disabled = true;
    document.getElementById(saveID).style.display = 'none';
    document.getElementById(cancelID).style.display = 'none';
    document.getElementById(editID).style.display = 'block';
}

/********************************************/
/* 				PROFILE 					*/
/********************************************/

/**
 * open_new_activity_form() : shows the elements of 'create a new activity' form
 */
function open_new_activity_form() {
	console.log('--->show');
	document.getElementById('add_activity_link').style.display = 'none';
	document.getElementById('cancel_activity_link').style.display = 'block';
	document.getElementById('add_activity_form').style.display = 'block';
    
    /*
	var minheight = 20;
	var maxheight = 300;
	var time = 1000;
	var timer = null;
	var toggled = false;

	var controler = document.getElementById('slide');
	var slider = document.getElementById('slider');
	slider.style.height = minheight + 'px';
	controler.onclick = function() {  
	clearInterval(timer);
	var instanceheight = parseInt(slider.style.height);
	var init = (new Date()).getTime();
	var height = (toggled = !toggled) ? maxheight: minheight; 
	
	var disp = height - parseInt(slider.style.height);
	timer = setInterval(function() {
	  var instance = (new Date()).getTime() - init;
	  if(instance < time ) {
	    var pos = Math.floor(disp * instance / time);
	    result = instanceheight + pos;
	    slider.style.height =  result + 'px';
	    document.getElementById('log').innerHTML = 'Current Height : <b>' + result + '</b><br /> Current Time : <b>' + instance + '</b>';
	  }else {
	    slider.style.height = height + 'px'; //safety side ^^
	    clearInterval(timer);
	    controler.value = toggled ? ' Slide Up ' :' Slide Down ';
	    document.getElementById('log').innerHTML = 'Current Height : <b>' + height + '</b><br /> Current Time : <b>' + time + '</b>';
	  }
	},1);
	};
*/
}

/**
 * close_new_activity_form() : hides the elements of 'create a new activity' form
 */
function close_new_activity_form() {
    console.log('--->hide');
    document.getElementById('add_activity_link').style.display = 'block';
    document.getElementById('cancel_activity_link').style.display = 'none';
    document.getElementById('add_activity_form').style.display = 'none';    
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
        console.log('distance');
        document.getElementById('time_activity').style.display = 'none';
        document.getElementById('distance_activity').style.display = 'block';
        document.getElementById('point_activity').style.display = 'none';
    }
    else if ( time.indexOf(choice.value) > -1 ) {
        console.log('time');
        document.getElementById('time_activity').style.display = 'block';
        document.getElementById('distance_activity').style.display = 'none';
        document.getElementById('point_activity').style.display = 'none';
    } 
    else if ( points.indexOf(choice.value) > -1 ) {
        console.log('points');
        document.getElementById('time_activity').style.display = 'none';
        document.getElementById('distance_activity').style.display = 'none';
        document.getElementById('point_activity').style.display = 'block';
    }
    else{
        console.log('none');
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

	
	
	
