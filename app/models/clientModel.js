'use strict';

// Load required packages
var mongoose = require('mongoose'),
	crypto = require('crypto');

// Define our client schema
var clientSchema = new mongoose.Schema({
	name: { type: String, unique: true, required: true },
	id: { type: String, required: true },
	secret: { type: String, required: true },
	userId: { type: String, required: true }
});

clientSchema.hashSecret = function(secret) {
	return crypto.createHash('sha512').update((process.env.CLIENT_SALT || 'clientSecret') + secret).digest('hex');
};

// Export the Mongoose model
module.exports = mongoose.model('Client', clientSchema);