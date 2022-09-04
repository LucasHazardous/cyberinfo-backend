const Article = require("../model/article");
const user_service = require("./user");
const config = require("../config/config");

module.exports = {
    async createArticle(title, content, image, categoryId, token) {
        await user_service.authorizeUser(token);

        await Article.findOneAndUpdate({
            title: title
        }, {
            title: title,
            content: content,
            image: image,
            categoryId: categoryId,
        }, {
            upsert: true
        });
    },
    async deleteArticle(id, token) {
        await user_service.authorizeUser(token);

        await Article.findByIdAndDelete(id);
    },
    async findArticleById(id) {
        return await Article.findById(id);
    },
    async getArticleList(page) {
        return await Article.find({}).skip(page * config.documentsPerPage).sort({
            _id: -1
        }).limit(config.documentsPerPage);
    },
    async likeArticle(id) {
        await Article.updateOne({
            _id: id
        }, {
            $inc: {
                likes: 1
            }
        });
    }
};