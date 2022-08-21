const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = {
    port: 80,
    minPasswordLength: 8,
    documentsPerPage: 10,
    authorizationErrorMsg: "Authorization failed",
    authenticationErrorMsg: "Authentication failed",
    maxRequestsPerTimeFrame: 100,
    requestsTimeFrameMinutes: 30 * 60000,
    emailTransport: nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    }),
    generateVerificationEmail(verificationToken, email) {
        return {
            from: '"Cyberinfo Newsletter" <newsletter@cyberinfo.website>',
            to: email,
            subject: "Newsletter verification",
            text: `localhost/api/newsletter/verify/${verificationToken}`,
            html: `<a>localhost/api/newsletter/verify/${verificationToken}</a>`
        }
    }
};