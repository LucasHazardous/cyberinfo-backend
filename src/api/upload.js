const express = require("express");
const router = express.Router();

const fileUpload = require('express-fileupload');
const ftp = require("basic-ftp");
const fs = require("fs");

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

async function removeAnduploadFileFTP(filename) {
    const client = new ftp.Client();
    await client.access({
        host: config.ftp_host,
        user: config.ftp_user,
        password: config.ftp_password,
        secure: false
    });
    await client.uploadFrom(__dirname + "/" + filename, filename);
    client.close();

    await fs.unlink(__dirname + "/" + filename, (err) => {
        if (err) throw err;
    });
}

router.post("/image", body("token").isString().isHexadecimal(), (req, res) => {
    if (handleValidationError(req, res)) return;

    if (!req.files || !req.files.image)
        return sendErrorStatusCode(config.fileUploadErrorMsg, res);

    const img = req.files.image;

    img.mv(__dirname + "/" + img.name, (err) => {
        if (err)
            return sendErrorStatusCode(err, res);
        res.sendStatus(200);
        removeAnduploadFileFTP(img.name).catch(err => console.log(err));
    });
});

module.exports = router;