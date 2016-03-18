'use strict';

// Load required packages
var mongoose = require('mongoose');

// Define our client schema
var feedbackSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    feedback: { type: String, required: true },
    feedbackType: { type: String, required: true },
    platform: { type: String, required: true },
    osVersion: { type: String, required: false },
    appVersion: { type: String, required: false },
    userAgent: { type: String, required: false },
    dateCreated : { type: Date }
});

feedbackSchema.pre('save', function(next){
    this.dateCreated = new Date();
    next();
});

// Export the Mongoose model
module.exports = mongoose.model('Feedback', feedbackSchema);