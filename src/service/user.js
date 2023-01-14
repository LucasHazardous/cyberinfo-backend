const Session = require('../model/session');
const User = require('../model/user');
const Fabrication = require('../model/fabrication');
const crypto = require('crypto');
const {
  authorizationErrorMsg,
  authenticationErrorMsg,
  userExistsErrorMsg,
  accessDeniedErrorMsg,
} = require('../config/config');

function generateToken(username) {
  return crypto
    .createHash('sha512')
    .update(String(Date.now()) + username + Math.random())
    .digest('hex');
}

function hashPassword(password) {
  return crypto
    .createHash('sha512')
    .update(password + process.env.SALT)
    .digest('base64');
}

function generateUserFabricationToken() {
  return crypto
    .createHash('sha256')
    .update(Date.now() + process.env.SALT)
    .digest('hex');
}

async function createAdminIfNeeded() {
  if (
    (await User.find({
      admin: true,
    }).count()) === 0
  )
    await User.create({
      username: process.env.ADMIN_USERNAME,
      password: hashPassword(process.env.ADMIN_PASSWORD),
      admin: true,
    });
}

createAdminIfNeeded().catch((err) => console.log(err));

module.exports = {
  async login(username, password) {
    if (
      await User.findOne({
        username: username,
        password: hashPassword(password),
      })
    ) {
      await Session.deleteOne({
        username: username,
      });

      const token = generateToken(username);

      await Session.create({
        username: username,
        token: token,
      });
      return token;
    }
    throw authenticationErrorMsg;
  },
  async logout(token) {
    const res = await Session.deleteOne({
      token: token,
    });
    return res.deletedCount;
  },
  async createUser(username, password, token) {
    if (!(await Fabrication.findOne({ token: token })))
      await this.authorizeAdmin(token);
    else await Fabrication.deleteOne({ token: token });

    const newUser = {
      username: username,
      password: hashPassword(password),
    };

    try {
      const res = await User.create(newUser);
      return res.username;
    } catch (error) {
      throw userExistsErrorMsg;
    }
  },
  async deleteUser(username, token) {
    await this.authorizeAdmin(token);

    const res = await User.deleteOne({
      username: username,
    });
    return res.deletedCount;
  },
  async authorizeUser(token) {
    const session = await Session.findOne({
      token: token,
    });
    if (!session) throw authorizationErrorMsg;
    return session;
  },
  async authorizeAdmin(token) {
    const sessionData = await Session.findOne({
      token: token,
    });
    if (!sessionData) throw authorizationErrorMsg;
    const userData = await User.findOne({
      username: sessionData.username,
    });
    if (!userData.admin) throw accessDeniedErrorMsg;
  },
  async isAdmin(username) {
    const userData = await User.findOne({
      username,
    });
    return userData.admin;
  },
  async getUserList(token) {
    await this.authorizeAdmin(token);

    const res = await User.find(
      {},
      {
        _id: 0,
        password: 0,
      }
    );
    return res;
  },
  async createUserFabricationToken(token) {
    this.authorizeAdmin(token);

    const fabricationToken = generateUserFabricationToken();

    Fabrication.create({
      token: fabricationToken,
    });

    return fabricationToken;
  },
};
