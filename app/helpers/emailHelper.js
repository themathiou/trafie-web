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
        message.html = '<h3>Hello ' + firstName + ',</h3>' +
            '<p>Welcome to trafie!</p>' +
            '<p>&nbsp;</p>' +
            'Click <a href="' + host + '/validate-email/' + hash + '">this link</a> to complete you registration and ' +
            'get full access to our features.<br>' +
            'If you have any questions, you can contact the trafie team by sending an email to support@trafie.com, ' +
            'by replying to this email, or by sending a message to ' +
            '<a href="https://www.facebook.com/trafie">www.facebook.com/trafie</a> on facebook.' +
            '<p>&nbsp;</p>' +
            '<p>Cheers!</p>' +
            '<p>&nbsp;</p>' +
            '<p><i>- The trafie team</i></p>';

        transporter.sendMail(message, function(error) {
            if (error) {
                console.warn('Error occured while sending email: ' + error);
                return;
            }
        });
    },

    sendResetPasswordEmail: function(email, firstName, lastName, hash) {
        message.to = email;
        message.subject = 'Password reset request';
        message.html = '<h2>Hello ' + firstName + ' ' + lastName + ',</h2>' +
            '<p>You have requested to reset the password of your account on trafie.</p><br>' +
            'Follow <a href="' + host + '/reset-password/' + hash + '">this link</a> in order to enter a new password.<br>';

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