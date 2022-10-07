const {
    authenticationErrorMsg
} = require("../../src/config/config");
const mongoose = require("mongoose");
const user_service = require("../../src/service/user");

var tmpToken;
var tmpUser = {
    "username": "tmpuser",
    "password": "tmppass"
};

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

test("User can log in", async () => {
    const response = await user_service.login(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);

    expect(response).not.toBe(authenticationErrorMsg);

    tmpToken = response;

    console.log(`Logged with token ${tmpToken}`);
});

test("Admin can create user", async () => {
    const response = await user_service.createUser(tmpUser.username, tmpUser.password, tmpToken);

    expect(response).toBe(tmpUser.username);
});

test("User can log out", async () => {
    const response = await user_service.logout(tmpToken);

    expect(response).toBeTruthy();
});

afterAll(async () => {
    await mongoose.connection.close();
});