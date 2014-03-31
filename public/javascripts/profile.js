//GENERAL VIARABLES
var disciplines = {
      'time': [
        '100m',
        '200m',
        '400m',
        '800m',
        '1500m',
        '3000m',
        '60m_hurdles',
        '100m_hurdles',
        '110m_hurdles',
        '400m_hurdles',
        '3000m_steeple',
        '4x100m_relay',
        '4x400m_relay',
        'marathon'
      ],
      'distance': [
        'high_jump',
        'long_jump',
        'triple_jump',
        'pole_vault',
        'shot_put',
        'discus',
        'hammer',
        'javelin'
      ],
      'points': [
        'pentathlon',
        'heptathlon',
        'decathlon'
      ]
    };


/********************************************/
/* 				EVENTS HANDLERS				*/
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
	var time = 300;
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
	var time = 200;
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

	//VARIABLES
	var delete_handler = function(e) {
		var evt = e ? e : window.event;
		if (evt.preventDefault) evt.preventDefault();

		var r = confirm(" Are you sure you want to delete this activity? ");
		if (r==true)
		{
			var that = this;
			ajax_delete(this.getAttribute('href'), function(res_status, res_text){
				console.log('delete_activity res : ',  res_status,  res_text );
				//success case
				if(res_status == 200) {
					var grandparent = that.parentNode.parentNode;
					grandparent.parentNode.removeChild(grandparent);
				}
				//error case
				else {
					alert('You can\'t delete this activity');
				}
			});
		}
	}

	var edit_handler = function() {
			var  node = this.parentNode.firstChild;
			while( node && node.nodeType === 1 && node !== this ) {
			node.style.display = 'none';
			if( node.getAttribute('class') == 'discipline') {
				//distance disciplines
			if( disciplines.distance.indexOf(node.getAttribute('data-value')) > -1 ) {
					var p = document.getElementById("editDistanceActivityTemplate");
					var edit_activity = p.cloneNode(true);
					edit_activity.style.display = 'block' ;
					this.parentNode.appendChild(edit_activity);
				}
				//time disciplines
				if( disciplines.time.indexOf(node.getAttribute('data-value')) > -1 ) {
					var p = document.getElementById("editTimeActivityTemplate");
					var edit_activity = p.cloneNode(true);
					edit_activity.style.display = 'block' ;
					this.parentNode.appendChild(edit_activity);
				}
		    	//points disciplines
		    	if( disciplines.points.indexOf(node.getAttribute('data-value')) > -1 ) {
					var p = document.getElementById("editPointsActivityTemplate");
					var edit_activity = p.cloneNode(true);
					edit_activity.style.display = 'block' ;
					this.parentNode.appendChild(edit_activity);
				}
			}
			node = node.nextElementSibling || node.nextSibling;
		}
	}


	//ATTACH HANDLERS
	document.getElementById("add_activity_link").onclick = function() {
		open_new_activity_form();
	}
	document.getElementById("cancel_activity_link").onclick = function() {
		close_new_activity_form();
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

	/* ADD activity form*/
	document.getElementById("add_activity_form").onsubmit = function (e) {
		var evt = e ? e : window.event;
		if (evt.preventDefault) evt.preventDefault();

		submit_form(this, function(response){
			if(response!='null') {
				var p = document.getElementById("newActivityTemplate");
				var new_activity = p.cloneNode(true);

				//make response object
				var res = JSON.parse(response);

				new_activity.style.display = 'block';
				new_activity.removeAttribute('id');
				new_activity.children[2].setAttribute('data-activity-id', res._id.replace(/\"/g, '') );
				new_activity.children[2].children[0].setAttribute('href', 'activities/'+res._id.replace(/\"/g, '') );
				new_activity.children[2].children[0].onclick = delete_handler;
				new_activity.children[2].children[1].innerHTML = res.performance;
				new_activity.children[2].children[2].innerHTML = res.discipline;
				new_activity.children[2].children[3].innerHTML = res.date.toString().split(' GMT')[0];
				new_activity.children[2].children[3].onclick = edit_handler;

				var list = document.getElementById('history_line');

				list.insertBefore( new_activity, list.firstChild.nextSibling );
				close_new_activity_form();

			} else {
				alert('something went wrong. Please try again');
				close_new_activity_form();
			}

		});
	}

	/*-- DELETE activity links --*/
	var deleteLinks = document.getElementsByClassName('deleteActivity');
	for (var i in deleteLinks) {
		deleteLinks[i].onmouseover = function() {
			this.parentNode.style.border = '1px solid #B43419';
		}

		deleteLinks[i].onmouseout = function() {
			this.parentNode.style.border = '1px solid white';
		}

		deleteLinks[i].onclick  = delete_handler;
	}

	/*-- EDIT activity links --*/
	var editLinks = document.getElementsByClassName('editActivity');
	for (var i in editLinks) {
		editLinks[i].onmouseover = function() {
			this.parentNode.style.border = '1px solid #F4B510';
		}

		editLinks[i].onmouseout = function() {
			this.parentNode.style.border = '1px solid white';
		}

		editLinks[i].onclick  = edit_handler;
	}

	var cancelEditLinks = document.getElementsByClassName('cancel_edit_activity');
	for (var i in cancelEditLinks) {
		cancelEditLinks[i].onclick = function() {
			var grandparent = this.parentNode.parentNode;
			grandparent.parentNode.removeChild(grandparent);
		}
	}


}



