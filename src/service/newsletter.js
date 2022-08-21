const Newsletter = require("../model/newsletter");
const crypto = require("crypto");

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
    },
    async verify(verificationToken) {
        await Newsletter.findOneAndUpdate({
            verificationToken: verificationToken
        }, {
            verified: true,
            $unset: {
                verificationToken: 1
            }
        }, {
            new: true
        });
    }
};