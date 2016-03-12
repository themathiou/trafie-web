// Load required packages
var mongoose = require('mongoose'),
	crypto = require('crypto');

// Define our token schema
var tokenSchema = new mongoose.Schema({
    value: {type: String, required: true},
    userId: {type: String, required: true},
    clientId: {type: String, required: true},
    expirationDate: {type: Date, required: false},
    scope: {type: Number, required: true},
    refresh: {type: Boolean, default: false, required: true},
    dateCreated : {type: Date}
});

tokenSchema.pre('save', function(next){
    var now = new Date();
    if (!this.dateCreated) {
        this.dateCreated = now;
    }
    next();
});

tokenSchema.pre('save', function(next) {
	this.value = tokenSchema.hashToken(this.value);
	next();
});

tokenSchema.hashToken = function(code) {
	return crypto.createHash('sha512').update('23tR@Ck@nDF!3lD04T0k3N' + code).digest('hex');
};

// Export the Mongoose model
module.exports = mongoose.model('Token', tokenSchema);