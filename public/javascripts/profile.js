/********************************************/
/* 				EVENTS HANDLERS				*/
/********************************************/

/* document.getElementById("id").event = function() { doSomething(); } */

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

/**
 * show_specific_form() : shows specific elements on 'create a new activity' form, based on selected discipline
 * @param choice : user's choice of discipline
 */
function show_specific_form(choice) {
    var distance = ['high_jump','long_jump','triple_jump', 'pole_vault', 'shot_put', 'discus', 'hammer', 'javelin'];
    var time = ['100m', '200m', '400m', '800m', '1500m', '3000m', '60m_hurdles', '100m_hurdles', '110m_hurdles', '400m_hurdles', '3000m_steeple', '4x100m_relay', '4x400m_relay', 'marathon'];
    var points = ['pentathlon', 'heptathlon', 'decathlon'];

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

/**
 * open_new_activity_form() : shows the elements of 'create a new activity' form
 */
function open_new_activity_form() {

	/* document.getElementById('add_activity_link').style.display = 'none';
	document.getElementById('cancel_activity_link').style.display = 'block';
	document.getElementById('add_activity_form').style.display = 'block'; */

    var minheight = 20;
	var maxheight = 210;
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

	document.getElementById('add_activity_link').setAttribute("onClick","close_new_activity_form();");
	document.getElementById('add_activity_link').setAttribute("href","javascript:;");

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

}

/**
 * profileHandlers() : handlers in profile page
 */
function profileHandlers() {
	document.getElementById("add_activity_link").onclick = function() {
		open_new_activity_form();
	}

	document.getElementById("discipline_input").onchange = function() {
		show_specific_form(this);
	}

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

	document.getElementById("distance_2_input").onkeyup = function() {
		number0to99(this);
	}

	document.getElementById("add_activity_form").onsubmit = function (e) {
		var evt = e ? e : window.event;
		if (evt.preventDefault) evt.preventDefault();

		submit_form(this, function(response){
			console.log(response);
		});
	}


/*
	show_specific_form('decathlon');
	var predefined_discipline = document.getElementById("discipline_input");
	show_specific_form(predefined_discipline.options[predefined_discipline.selectedIndex].value);
	console.log(predefined_discipline.options[predefined_discipline.selectedIndex].value);
*/

}



