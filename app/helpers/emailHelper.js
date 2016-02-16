'use strict';

const nodemailer = require('nodemailer');
const emailConfig = require('../config/emailConfig');
const host = process.env.NODE_ENV === 'production' ? 'https://www.trafie.com' : 'localhost:3000';

var transporter = nodemailer.createTransport(emailConfig);

// Message object
var message = {
    from: 'Trafie support <support@trafie.com>'
};

var emailHelper = {
    sendVerificationEmail: function(email, firstName, lastName, hash) {
        message.to = email;
        message.subject = 'Welcome to Trafie!';
        message.html = '<h2>Hello ' + firstName + ' ' + lastName + '</h2>' +
            '<p>You have successfully registered to trafie.</p><br><p>The <b><i>trafie</i></b> team</p><br>' +
            'Follow the link to verify your email:<br>' +
            '<a href="' + host + '/validate/' + hash + '">This is the link</a>';

        console.log('sending');
        transporter.sendMail(message, function(error) {
            console.log('sent', error);
            if (error) {
                console.warn('Error occured while sending email: ' + error);
                return;
            }
        });
    },

    sendResetPasswordEmail: function(email, firstName, lastName, hash) {
        message.to = email;
        message.subject = 'Password reset request';
        message.html = '<h2>Hello ' + firstName + ' ' + lastName + '</h2>' +
            '<p>You have requested to reset the password of your account on trafie.</p><br>' +
            'Follow the link in order to enter a new password:<br>' +
            '<a href="' + host + '/reset_password/' + hash + '">This is the link</a>';

        transporter.sendMail(message, function(error) {
            if (error) {
                console.warn('Error occured while sending email: ' + error);
                return;
            }
        });
    },

    sendEmail: function(email_address, email_text, email_subject) {
        message.to = email_address;
        message.html = email_text;
        message.subject = email_subject || '';

        transporter.sendMail(message, function(error) {
            if (error) {
                console.warn('Error occured while sending email: ' + error);
                return;
            }
        });
    }
};

module.exports = emailHelper;