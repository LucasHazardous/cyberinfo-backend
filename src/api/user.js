const express = require('express');
const router = express.Router();

const user_service = require('../service/user');

const { body, param } = require('express-validator');

const { minPasswordLength } = require('../config/config');

const { sendErrorStatusCode, handleValidationError } = require('../error/api');

router.post(
  '/login',
  body('username').isString(),
  body('password').isString().isLength({
    min: minPasswordLength,
  }),
  (req, res) => {
    if (handleValidationError(req, res)) return;

    user_service
      .login(req.body.username, req.body.password)
      .then((token) =>
        res.json({
          token: token,
        })
      )
      .catch((err) => sendErrorStatusCode(err, res));
  }
);

router.post('/logout', body('token').isString().isHexadecimal(), (req, res) => {
  if (handleValidationError(req, res)) return;

  user_service
    .logout(req.body.token)
    .then((result) => res.sendStatus(result ? 200 : 404))
    .catch((err) => sendErrorStatusCode(err, res));
});

router.post(
  '/',
  body('username').isString(),
  body('password').isString().isLength({
    min: minPasswordLength,
  }),
  body('token').isString().isHexadecimal(),
  (req, res) => {
    if (handleValidationError(req, res)) return;

    user_service
      .createUser(req.body.username, req.body.password, req.body.token)
      .then((result) => res.sendStatus(result !== null ? 200 : 403))
      .catch((err) => sendErrorStatusCode(err, res));
  }
);

router.delete(
  '/:username',
  param('username').isString(),
  body('token').isString().isHexadecimal(),
  (req, res) => {
    if (handleValidationError(req, res)) return;

    user_service
      .deleteUser(req.params.username, req.body.token)
      .then((result) => res.sendStatus(result ? 200 : 404))
      .catch((err) => sendErrorStatusCode(err, res));
  }
);

router.post('/list', body('token').isString().isHexadecimal(), (req, res) => {
  if (handleValidationError(req, res)) return;

  user_service
    .getUserList(req.body.token)
    .then((result) => res.json(result))
    .catch((err) => sendErrorStatusCode(err, res));
});

module.exports = router;
