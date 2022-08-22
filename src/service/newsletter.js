const Newsletter = require("../model/newsletter");
const user_service = require("./user");
const crypto = require("crypto");
const {
    emailTransport,
    email_address
} = require("../config/config");

function generateVerificationToken(email) {
    return crypto
        .createHash("sha512")
        .update(email + Date.now())
        .digest("base64url");
}

function generateVerificationEmail(verificationToken, email) {
    return {
        from: `"Cyberinfo Newsletter" <${email_address}>`,
        to: email,
        subject: "Newsletter verification",
        text: `localhost/api/newsletter/verify/${verificationToken}`,
        html: `<a>localhost/api/newsletter/verify/${verificationToken}</a>`
    }
}

function generateNewsletterEmail(subject, message_plain, message_html, email) {
    return {
        from: `"Cyberinfo Newsletter" <${email_address}>`,
        to: email,
        subject: subject,
        text: message_plain,
        html: message_html
    }
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
    },
    async sendNewsletterToVerifiedPeople(subject, message_plain, message_html, token) {
        await user_service.authorizeUser(token);

        const users = await Newsletter.find({
            verificationToken: {
                $exists: false
            }
        });

        users.forEach(user => emailTransport.sendMail(
            generateNewsletterEmail(subject, message_plain, message_html, user.email)
        ));
    }
};