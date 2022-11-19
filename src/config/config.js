const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = {
    port: process.env.PORT,
    minPasswordLength: 8,
    documentsPerPage: 10,
    authorizationErrorMsg: "Authorization failed",
    authenticationErrorMsg: "Authentication failed",
    fileUploadErrorMsg: "File upload failed",
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
    email_address: process.env.EMAIL_USER,
    sessionActiveHours: 1,
    maxUploadFileSize: 10 * 1024 * 1024
};