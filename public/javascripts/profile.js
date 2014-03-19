/********************************************/
/* 				EVENTS HANDLERS				*/
/********************************************/

/* document.getElementById("id").event = function() { doSomething(); } */

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
}



