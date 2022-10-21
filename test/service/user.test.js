const {
    authenticationErrorMsg
} = require("../../src/config/config");
const mongoose = require("mongoose");
const user_service = require("../../src/service/user");

let tmpToken;
const tmpUser = {
    "username": "tmpuser",
    "password": "tmppass"
};

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

test("User can log in", async () => {
    const res = await user_service.login(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);

    expect(res).not.toBe(authenticationErrorMsg);

    tmpToken = res;

    console.log(`Logged with token ${tmpToken}`);
});

test("Admin can create user", async () => {
    const res = await user_service.createUser(tmpUser.username, tmpUser.password, tmpToken);

    expect(res).toBe(tmpUser.username);
});

test("Admin can get user list", async () => {
    const res = await user_service.getUserList(tmpToken);

    console.log(res);

    expect(res.length).toBeGreaterThanOrEqual(2);
});

test("Admin can delete user", async () => {
    const res = await user_service.deleteUser(tmpUser.username, tmpToken);

    expect(res).toBeTruthy();
});

test("User can log out", async () => {
    const res = await user_service.logout(tmpToken);

    expect(res).toBeTruthy();
});

afterAll(async () => {
    await mongoose.connection.close();
});