const Session = require("../model/session");
const User = require("../model/user");
const crypto = require("crypto");

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
        return "";
    },
    async logout(token) {
        await Session.deleteOne({
            token: token
        });
    },
    async createUser(username, password, token) {
        await this.authorizeUser(token);

        const newUser = {
            username: username,
            password: hashPassword(password)
        };

        await User.create(newUser);

        return "";
    },
    async authorizeUser(token) {
        if (!(await Session.findOne({
                token: token
            }))) throw "Authorization failed";
    }
};