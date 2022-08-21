const express = require("express");
const router = express.Router();

const newsletter_service = require("../service/newsletter");

const {
    body,
    param
} = require('express-validator');

const {
    sendErrorStatusCode,
    handleValidationError
} = require("../error/api");

router.post("/join", body("email").isString().isEmail(), (req, res) => {
    if (handleValidationError(req, res)) return;

    newsletter_service.joinNewsletter(req.body.email)
        .then(result => res.sendStatus(200))
        .catch(err => sendErrorStatusCode(err, res));
});

router.get("/verify/:verificationToken", param("verificationToken").isString(), (req, res) => {
    if (handleValidationError(req, res)) return;

    newsletter_service.verify(req.params.verificationToken)
        .then(result => res.sendStatus(200))
        .catch(err => sendErrorStatusCode(err, res));
});

module.exports = router;