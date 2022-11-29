const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = {
    port: process.env.PORT,
    minPasswordLength: 8,
    documentsPerPage: 10,
    authorizationErrorMsg: "Authorization failed",
    authenticationErrorMsg: "Authentication failed",
    fileUploadErrorMsg: "File upload failed",
    userExistsErrorMsg: "User already exists",
    accessDeniedErrorMsg: "Access denied",
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
    maxUploadFileSize: 10 * 1024 * 1024,
    ftp_host: process.env.FTP_HOST,
    ftp_user: process.env.FTP_USER,
    ftp_password: process.env.FTP_PASSWORD,
    allowedFTPFileMimetypes: new Set(["image/png", "image/jpeg", "image/jpg", "image/gif"]),
    apiDomain: process.env.API_DOMAIN
};