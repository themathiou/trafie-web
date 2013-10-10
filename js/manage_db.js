$(document).ready(
 function(){
	$('.add_element').on('click',function(){
		$(this).closest('.cell').find('.new_element_container').css('display', 'inline-block');
	});
});

