const Session = require("../model/session");
const User = require("../model/user");
const crypto = require("crypto");
const {
    authorizationErrorMsg,
    authenticationErrorMsg
} = require("../config/config");

function generateToken(username) {
    return crypto
        .createHash("sha512")
        .update(String(Date.now()) + username + Math.random())
        .digest("hex");
}

function hashPassword(password) {
    return crypto
        .createHash("sha512")
        .update(password + process.env.SALT)
        .digest("base64");
}

async function createAdminIfNeeded() {
    if (await User.find({
            admin: true
        }).count() === 0)
        await User.create({
            username: process.env.ADMIN_USERNAME,
            password: hashPassword(process.env.ADMIN_PASSWORD),
            admin: true
        });
}

createAdminIfNeeded().catch(err => console.log(err));

module.exports = {
    async login(username, password) {
        if (await User.findOne({
                username: username,
                password: hashPassword(password)
            })) {
            await Session.deleteOne({
                username: username
            });

            const token = generateToken(username);

            await Session.create({
                username: username,
                token: token
            });
            return token;
        }
        return authenticationErrorMsg;
    },
    async logout(token) {
        const res = await Session.deleteOne({
            token: token
        });
        return res.acknowledged;
    },
    async createUser(username, password, token) {
        await this.authorizeAdmin(token);

        const newUser = {
            username: username,
            password: hashPassword(password)
        };

        const res = await User.create(newUser);
        return res.toJSON().username;
    },
    async deleteUser(username, token) {
        await this.authorizeAdmin(token);

        await User.deleteOne({
            username: username
        });
    },
    async authorizeUser(token) {
        if (!(await Session.findOne({
                token: token
            }))) throw authorizationErrorMsg;
    },
    async authorizeAdmin(token) {
        const sessionData = await Session.findOne({
            token: token
        });
        if (!sessionData) throw authorizationErrorMsg;
        const userData = await User.findOne({
            username: sessionData.username
        });
        if (!userData.admin) throw authorizationErrorMsg;
    }
};