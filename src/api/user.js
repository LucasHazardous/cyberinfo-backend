const express = require("express");
const router = express.Router();

const user_service = require("../service/user");

const {
    body,
    validationResult
} = require('express-validator');

const {
    minPasswordLength
} = require("../config/config");

const {
    sendErrorStatusCode
} = require("../error/api");

router.post("/login", body("username").isString(), body("password").isString().isLength({
    min: minPasswordLength
}), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    user_service.login(req.body.username, req.body.password)
        .then(token => res.json({
            token: token
        }))
        .catch(err => sendErrorStatusCode(err, res));
});

router.post("/logout", body("token").isString().isHexadecimal(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    user_service.logout(req.body.token)
        .then(result => res.sendStatus(200))
        .catch(err => sendErrorStatusCode(err, res));
});

router.post("/", body("username").isString(), body("password").isString().isLength({
    min: minPasswordLength
}), body("token").isString().isHexadecimal(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    user_service.createUser(req.body.username, req.body.password, req.body.token)
        .then(result => res.sendStatus(200))
        .catch(err => sendErrorStatusCode(err, res));
});

module.exports = router;