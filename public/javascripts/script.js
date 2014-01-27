/*--------------------------------------------------- Settings dropdown menu */
function editField( fieldID, saveID, cancelID, editID ) {
    // console.log(fieldID +  saveID + editID );
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

	
// var distance = ['high_jump','long_jump','triple_jump', 'pole_vault', 'shot_put', 'discus', 'hammer', 'javelin'];
// var time = ['100m', '200m', '400m', '800m', '1500m', '3000m', '60m_hurdles', '100m_hurdles', '110m_hurdles', '400m_hurdles', '3000m_steeple', '4x100m_relay', '4x400m_relay', 'marathon'];
// var points = ['pentathlon', 'heptathlon', 'decathlon'];
	
	
	
