const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const newsletter_service = require('../../src/service/newsletter');

let tmpEmail;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const testAccount = await nodemailer.createTestAccount();
  tmpEmail = testAccount.user;

  console.log(`Test account email: ${testAccount.user}`);
  console.log(`Test account password: ${testAccount.pass}`);
});

test('Join newsletter', async () => {
  const res = await newsletter_service.joinNewsletter(tmpEmail);

  expect(res).toBeTruthy();
});

test('Leave newsletter', async () => {
  const res = await newsletter_service.leaveNewsletter(tmpEmail);

  expect(res).toBeTruthy();
});

afterAll(async () => {
  await mongoose.connection.close();
});
