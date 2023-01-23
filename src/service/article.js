const Article = require('../model/article');
const user_service = require('./user');
const config = require('../config/config');

module.exports = {
  async createArticle(title, content, image, categoryId, token) {
    const userSession = await user_service.authorizeUser(token);

    try {
      const res = await Article.findOneAndUpdate(
        {
          title: title,
          ...(!(await user_service.isAdmin(userSession.username)) && {
            author: userSession.username,
          }),
        },
        {
          title: title,
          author: userSession.username,
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
    } catch (e) {
      if (e.codeName === 'DuplicateKey') throw config.accessDeniedErrorMsg;
      else throw e;
    }
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
    return await Article.aggregate([
      {
        $search: {
          index: 'articleSearch',
          autocomplete: {
            query: term,
            path: 'title',
            fuzzy: {
              prefixLength: 4,
            },
          },
        },
      },
      { $skip: page * config.documentsPerPage },
      { $limit: config.documentsPerPage },
    ]);
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
