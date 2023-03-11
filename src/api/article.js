const express = require('express');
const router = express.Router();

const article_service = require('../service/article');

const { body, param, query } = require('express-validator');

const { sendErrorStatusCode, handleValidationError } = require('../error/api');

router.get('/newest/:page', param('page').isNumeric(), (req, res) => {
  if (handleValidationError(req, res)) return;

  article_service
    .getNewestArticleList(req.params.page)
    .then((result) => res.json(result))
    .catch((err) => sendErrorStatusCode(err, res));
});

router.get('/most_liked/:page', param('page').isNumeric(), (req, res) => {
  if (handleValidationError(req, res)) return;

  article_service
    .getMostLikedArticleList(req.params.page)
    .then((result) => res.json(result))
    .catch((err) => sendErrorStatusCode(err, res));
});

router.get('/category/:category', param('category').isNumeric(), (req, res) => {
  if (handleValidationError(req, res)) return;

  article_service
    .getArticlesWithCategory(req.params.category)
    .then((result) => res.json(result))
    .catch((err) => sendErrorStatusCode(err, res));
});

router.get(
  '/search/:page',
  query('term').isString().isLength({
    min: 4,
    max: 20,
  }),
  param('page').isNumeric(),
  (req, res) => {
    if (handleValidationError(req, res)) return;

    article_service
      .getSearchResults(req.query.term, req.params.page)
      .then((result) => res.json(result))
      .catch((err) => sendErrorStatusCode(err, res));
  }
);

router.get(
  '/id/:id',
  param('id').isString().isMongoId(),
  query('lang')
    .optional()
    .isString()
    .matches(/^en$|^pl$/),
  (req, res) => {
    if (handleValidationError(req, res)) return;

    article_service
      .findArticleById(req.params.id, req.query.lang)
      .then((result) => res.json(result))
      .catch((err) => sendErrorStatusCode(err, res));
  }
);

router.post(
  '/',
  body('title').isString(),
  body('content').isString(),
  body('image').isString(),
  body('categoryId').isString(),
  body('token').isString().isHexadecimal(),
  (req, res) => {
    if (handleValidationError(req, res)) return;

    article_service
      .createArticle(
        req.body.title,
        req.body.content,
        req.body.image,
        req.body.categoryId,
        req.body.token
      )
      .then((result) => res.sendStatus(200))
      .catch((err) => sendErrorStatusCode(err, res));
  }
);

router.delete(
  '/:id',
  param('id').isString().isMongoId(),
  body('token').isString().isHexadecimal(),
  (req, res) => {
    if (handleValidationError(req, res)) return;

    article_service
      .deleteArticle(req.params.id, req.body.token)
      .then((result) => res.sendStatus(result ? 200 : 404))
      .catch((err) => sendErrorStatusCode(err, res));
  }
);

router.get('/like/:id', param('id').isString().isMongoId(), (req, res) => {
  if (handleValidationError(req, res)) return;

  article_service
    .likeArticle(req.params.id)
    .then((result) => res.sendStatus(result ? 200 : 500))
    .catch((err) => sendErrorStatusCode(err, res));
});

module.exports = router;
