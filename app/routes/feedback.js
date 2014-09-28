'use strict';

/**
 * Feedback - POST
 */
exports.post = function( req, res ){
	if( typeof req.body.feedback_text !== 'undefined' ) {
		console.log( req.headers );
		let email_data = {
			feedback_text: feedback_text,
			user_agent: req.headers['user-agent']
		}
	}
};