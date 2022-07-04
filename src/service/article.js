const Article = require("../model/article");
const user_service = require("./user");
const config = require("../config/config");

module.exports = {
    async createArticle(username, title, content, token) {
        await user_service.authorizeUser(token);

        await Article.create({
            username: username,
            title: title,
            content: content
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
        return await Article.find({}).skip(page).sort({_id: -1}).limit(config.documentsPerPage);
    }
};