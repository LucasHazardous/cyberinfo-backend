const Newsletter = require('../model/newsletter');
const user_service = require('./user');
const crypto = require('crypto');
const {
  emailTransport,
  email_address,
  apiDomain,
} = require('../config/config');

function generateVerificationToken(email) {
  return crypto
    .createHash('sha512')
    .update(email + Date.now())
    .digest('base64url');
}

function generateVerificationEmail(verificationToken, email) {
  const verificationLink = `${
    apiDomain == undefined ? 'localhost' : apiDomain
  }/api/newsletter/verify/${verificationToken}`;
  return {
    from: `"Cyberinfo Newsletter" <${email_address}>`,
    to: email,
    subject: 'Newsletter verification',
    text: verificationLink,
    html: `<a>${verificationLink}</a>`,
  };
}

function generateNewsletterEmail(subject, message_plain, message_html, email) {
  return {
    from: `"Cyberinfo Newsletter" <${email_address}>`,
    to: email,
    subject: subject,
    text: message_plain,
    html: message_html,
  };
}

module.exports = {
  async joinNewsletter(email) {
    const verificationToken = generateVerificationToken(email);

    const existing = await Newsletter.findOne({
      email: email,
    });

    if (existing !== null) return false;

    const insertionRes = await Newsletter.create({
      email: email,
      verificationToken: verificationToken,
    });

    const emailRes = await emailTransport.sendMail(
      generateVerificationEmail(verificationToken, email)
    );

    return insertionRes.email === email && emailRes.accepted.includes(email);
  },
  async leaveNewsletter(email) {
    const res = await Newsletter.deleteOne({
      email: email,
    });
    return res.deletedCount;
  },
  async verify(verificationToken) {
    const res = await Newsletter.updateOne(
      {
        verificationToken: verificationToken,
      },
      {
        $unset: {
          verificationToken: 1,
        },
      }
    );
    return res.modifiedCount;
  },
  async sendNewsletterToVerifiedPeople(
    subject,
    message_plain,
    message_html,
    token
  ) {
    await user_service.authorizeUser(token);

    const users = await Newsletter.find({
      verificationToken: {
        $exists: false,
      },
    });

    users.forEach((user) =>
      emailTransport.sendMail(
        generateNewsletterEmail(
          subject,
          message_plain,
          message_html,
          user.email
        )
      )
    );
  },
};
