const express = require("express");
const router = express.Router();

const fileUpload = require('express-fileupload');

const config = require("../config/config");

router.use(fileUpload({
    limits: {
        files: 1,
        fileSize: config.maxUploadFileSize
    }
}));

const {
    body
} = require('express-validator');

const {
    sendErrorStatusCode,
    handleValidationError
} = require("../error/api");

router.post("/image", body("token").isString().isHexadecimal(), (req, res) => {
    if (handleValidationError(req, res)) return;

    if (!req.files || !req.files.image)
        return sendErrorStatusCode(config.fileUploadErrorMsg, res);

    req.files.image.mv(__dirname + "/" + req.files.image.name, (err) => {
        if (err)
            return sendErrorStatusCode(err, res);
        res.sendStatus(200);
    });
});

module.exports = router;