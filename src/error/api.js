const {
    authorizationErrorMsg,
    authenticationErrorMsg,
    fileUploadErrorMsg
} = require("../config/config");

const {
    validationResult
} = require('express-validator');

module.exports = {
    sendErrorStatusCode(err, res) {
        console.log(err);
        if (err === authorizationErrorMsg) res.sendStatus(403);
        else if (err === authenticationErrorMsg) res.sendStatus(401);
        else if (err === fileUploadErrorMsg) res.sendStatus(400);
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