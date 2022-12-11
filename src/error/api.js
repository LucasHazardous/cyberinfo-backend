const {
  authorizationErrorMsg,
  authenticationErrorMsg,
  fileUploadErrorMsg,
  userExistsErrorMsg,
  accessDeniedErrorMsg,
} = require('../config/config');

const { validationResult } = require('express-validator');

module.exports = {
  sendErrorStatusCode(err, res) {
    console.log(err);
    let status = 500;
    switch (err) {
      case authenticationErrorMsg:
      case authorizationErrorMsg:
        status = 401;
        break;
      case accessDeniedErrorMsg:
        status = 403;
        break;
      case fileUploadErrorMsg:
        status = 400;
        break;
      case userExistsErrorMsg:
        status = 409;
        break;
    }
    if (status === 500) res.sendStatus(status);
    else res.status(status).send(err);
  },
  handleValidationError(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        errors: errors.array(),
      });
      return true;
    }
    return false;
  },
};
