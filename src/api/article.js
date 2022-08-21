const express = require("express");
const router = express.Router();

const article_service = require("../service/article");

const {
    body,
    param
} = require('express-validator');

const {
    sendErrorStatusCode,
    handleValidationError
} = require("../error/api");

router.get("/list/:page", param("page").isNumeric(), (req, res) => {
    if (handleValidationError(req, res)) return;

    article_service.getArticleList(req.params.page)
        .then(result => res.json(result))
        .catch(err => sendErrorStatusCode(err, res));
});

router.get("/:id", param("id").isString().isMongoId(), (req, res) => {
    if (handleValidationError(req, res)) return;

    article_service.findArticleById(req.params.id)
        .then(result => res.json(result))
        .catch(err => sendErrorStatusCode(err, res));
});

router.post("/", body("username").isString(), body("title").isString(), body("content").isString(), body("token").isString().isHexadecimal(), (req, res) => {
    if (handleValidationError(req, res)) return;

    article_service.createArticle(req.body.username, req.body.title, req.body.content, req.body.token)
        .then(result => res.sendStatus(200))
        .catch(err => sendErrorStatusCode(err, res));
});

router.delete("/:id", param("id").isString().isMongoId(), body("token").isString().isHexadecimal(), (req, res) => {
    if (handleValidationError(req, res)) return;

    article_service.deleteArticle(req.params.id, req.body.token)
        .then(result => res.sendStatus(200))
        .catch(err => sendErrorStatusCode(err, res));
});

module.exports = router;