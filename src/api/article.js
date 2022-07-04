const express = require("express");
const router = express.Router();

const article_service = require("../service/article");

const {
    body,
    validationResult,
    param
} = require('express-validator');

router.get("/list/:page", param("page").isNumeric(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    article_service.getArticleList(req.params.page)
        .then(result => res.json(result))
        .catch(err => handleError(err, res));
});

router.get("/:id", param("id").isString().isMongoId(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    article_service.findArticleById(req.params.id)
        .then(result => res.json(result))
        .catch(err => handleError(err, res));
});

router.post("/", body("username").isString(), body("title").isString(), body("content").isString(), body("token").isString().isHexadecimal(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    article_service.createArticle(req.body.username, req.body.title, req.body.content, req.body.token)
        .then(result => res.sendStatus(200))
        .catch(err => handleError(err, res));
});

router.delete("/:id", param("id").isString().isMongoId(), body("token").isString().isHexadecimal(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    article_service.deleteArticle(req.params.id, req.body.token)
        .then(result => res.sendStatus(200))
        .catch(err => handleError(err, res));
});

function handleError(err, res) {
    console.log(err);
    if (err == "Authorization failed") res.sendStatus(401);
    else res.sendStatus(500);
}

module.exports = router;