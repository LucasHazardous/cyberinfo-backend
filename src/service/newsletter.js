const Newsletter = require("../model/newsletter");
const crypto = require("crypto");
const {
    emailTransport,
    generateVerificationEmail
} = require("../config/config");

function generateVerificationToken(email) {
    return crypto
        .createHash("sha512")
        .update(email + Date.now())
        .digest("base64url");
}

module.exports = {
    async joinNewsletter(email) {
        const verificationToken = generateVerificationToken(email);

        await Newsletter.create({
            email: email,
            verificationToken: verificationToken
        });

        emailTransport.sendMail(generateVerificationEmail(verificationToken, email));
    },
    async verify(verificationToken) {
        await Newsletter.updateOne({
            verificationToken: verificationToken
        }, {
            $unset: {
                verificationToken: 1
            }
        });
    }
};