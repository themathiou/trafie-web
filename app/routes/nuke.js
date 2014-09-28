'use strict';

/**
 * Nuke - GET
 */
exports.get = function( req, res ){
	let action = '/feedback';
	let method = 'POST';
	let value_name = 'feedback_text';

	let html = '<html><body>\
			<form action="' + action + '" method="' + method + '" id="the-form">\
				<input type="text" name="' + value_name + '">\
				<input type="submit" value="Nuke it!">\
			</form>\
			<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>\
			<script>\
				//$("#the-form").on("submit", function(){});\
			</script>\
		</body></html>';

	res.send(html);
};