const Article = require('../model/article');
const user_service = require('./user');
const config = require('../config/config');

module.exports = {
  async createArticle(title, author, content, image, categoryId, token) {
    await user_service.authorizeUser(token);

    const res = await Article.findOneAndUpdate(
      {
        title: title,
      },
      {
        title: title,
        author: author,
        content: content,
        image: image,
        categoryId: categoryId,
      },
      {
        upsert: true,
        new: true,
      }
    );

    return res.title;
  },
  async deleteArticle(id, token) {
    await user_service.authorizeAdmin(token);

    const res = await Article.findByIdAndDelete(id);
    return res !== null;
  },
  async findArticleById(id) {
    return await Article.findById(id);
  },
  async findArticleByTitle(title) {
    return await Article.findOne({
      title: title,
    });
  },
  async getSearchResults(term, page) {
    return await Article.find(
      {
        $text: {
          $search: term,
        },
      },
      config.articleListProjection
    )
      .skip(page * config.documentsPerPage)
      .limit(config.documentsPerPage);
  },
  async getNewestArticleList(page) {
    return await Article.find({}, config.articleListProjection)
      .sort({
        _id: -1,
      })
      .skip(page * config.documentsPerPage)
      .limit(config.documentsPerPage);
  },
  async getMostLikedArticleList(page) {
    return await Article.find({}, config.articleListProjection)
      .sort({
        likes: -1,
      })
      .skip(page * config.documentsPerPage)
      .limit(config.documentsPerPage);
  },
  async getArticlesWithCategory(category) {
    return await Article.find(
      {
        categoryId: category,
      },
      config.articleListProjection
    );
  },
  async likeArticle(id) {
    const res = await Article.updateOne(
      {
        _id: id,
      },
      {
        $inc: {
          likes: 1,
        },
      }
    );
    return res.modifiedCount;
  },
};
