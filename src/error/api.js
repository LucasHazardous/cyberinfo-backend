const {
    authorizationErrorMsg,
    authenticationErrorMsg,
    fileUploadErrorMsg,
    userExistsErrorMsg,
    accessDeniedErrorMsg
} = require("../config/config");

const {
    validationResult
} = require('express-validator');

module.exports = {
    sendErrorStatusCode(err, res) {
        console.log(err);
        if (err === authorizationErrorMsg) res.status(401).send(authorizationErrorMsg);
        else if (err === accessDeniedErrorMsg) res.status(403).send(accessDeniedErrorMsg);
        else if (err === authenticationErrorMsg) res.status(401).send(authenticationErrorMsg);
        else if (err === fileUploadErrorMsg) res.status(400).send(fileUploadErrorMsg);
        else if (err === userExistsErrorMsg) res.status(409).send(userExistsErrorMsg);
        else res.sendStatus(500);
    },
    handleValidationError(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                errors: errors.array()
            });
            return true;
        }
        return false;
    }
}