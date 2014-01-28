/*--------------------------------------------------- Settings dropdown menu */
function editField( fieldID, saveID, cancelID, editID ) {
    document.getElementById(fieldID).disabled = false;
    document.getElementById(saveID).style.display = 'block';
    document.getElementById(cancelID).style.display = 'block';
    document.getElementById(editID).style.display = 'none';
}

function cancelEditField (fieldID_shadow, fieldID, saveID, cancelID, editID ) {
    document.getElementById(fieldID).value = document.getElementById(fieldID_shadow).value;
    document.getElementById(fieldID).disabled = true;
    document.getElementById(saveID).style.display = 'none';
    document.getElementById(cancelID).style.display = 'none';
    document.getElementById(editID).style.display = 'block';
}


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
        console.log('none'); //TO BE REMOVED!
        document.getElementById('time_activity').style.display = 'none';
        document.getElementById('distance_activity').style.display = 'none';
        document.getElementById('point_activity').style.display = 'none';
    } 
}

function open_new_activity_form() {
    console.log('--->show');
    document.getElementById('add_activity_link').style.display = 'none';
    document.getElementById('cancel_activity_link').style.display = 'block';
    document.getElementById('add_activity_form').style.display = 'block';
}

function close_new_activity_form() {
    console.log('--->hide');
    document.getElementById('add_activity_link').style.display = 'block';
    document.getElementById('cancel_activity_link').style.display = 'none';
    document.getElementById('add_activity_form').style.display = 'none';    
}

function number0to59(input) {
    if (input.value < 0) input.value = 0;
    if (input.value > 59) input.value = 59;
    }

function number0to99(input) {
    if (input.value < 0) input.value = 0;
    if (input.value > 99) input.value = 99;
  }

// var distance = ['high_jump','long_jump','triple_jump', 'pole_vault', 'shot_put', 'discus', 'hammer', 'javelin'];
// var time = ['100m', '200m', '400m', '800m', '1500m', '3000m', '60m_hurdles', '100m_hurdles', '110m_hurdles', '400m_hurdles', '3000m_steeple', '4x100m_relay', '4x400m_relay', 'marathon'];
// var points = ['pentathlon', 'heptathlon', 'decathlon'];
	
	
	
