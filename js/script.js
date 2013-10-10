/*--------------------------------------------------- Settings dropdown menu */
$(function(){
    $("ul.dropdown li").hover(function(){
        $(this).addClass("hover");
        $('ul:first',this).css('visibility', 'visible');
    }, function(){
        $(this).removeClass("hover");
        $('ul:first',this).css('visibility', 'hidden');
    });
    $("ul.dropdown li ul li:has(ul)").find("a:first").append(" &raquo; ");
});

/*---------------------------------------------------  Add new activity */

$(function(){
	$('#toggle_new_activity').on('click',function(){
		$(this).parent().find('form').slideToggle();
	});
});

/*---------------------------------------------------  replace Performance INPUT field based on select */    
$(function(){
	$('#discipline_input').change(function(){
	
	var distance = ['high_jump','long_jump','triple_jump', 'pole_vault', 'shot_put', 'discus', 'hammer', 'javelin'];
	var time = ['100m', '200m', '400m', '800m', '1500m', '3000m', '60m_hurdles', '100m_hurdles', '110m_hurdles', '400m_hurdles', '3000m_steeple', '4x100m_relay', '4x400m_relay', 'marathon'];
	var points = ['pentathlon', 'heptathlon', 'decathlon'];
	
	
	$("#distance_activity").find('input').prop('disabled', true);
	$("#time_activity").find('input').prop('disabled', true);
	$("#point_activity").find('input').prop('disabled', true);
    
        if (points.indexOf($(this).val()) > -1) 
        {
        	console.log("points measurement");
        	document.getElementById("point_activity").style.display="block";
	        $("#point_activity").find('input').prop('disabled', false);
        	document.getElementById("distance_activity").style.display="none";
			document.getElementById("time_activity").style.display="none";      	
        	
        } 
        else if(distance.indexOf($(this).val()) > -1)
        {
        	console.log("distance measurement"); 
        	document.getElementById("point_activity").style.display="none";
        	document.getElementById("distance_activity").style.display="block";
        	$("#distance_activity").find('input').prop('disabled', false);
        	document.getElementById("time_activity").style.display="none";         
        } 
        else
        {
	        console.log("time measurement");
        	document.getElementById("point_activity").style.display="none";
        	document.getElementById("distance_activity").style.display="none";
        	document.getElementById("time_activity").style.display="block";
        	$("#time_activity").find('input').prop('disabled', false);
        }
    }); 
});
