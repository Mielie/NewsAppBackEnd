const articlesRouter = require("express").Router();

const {
	getArticles,
	getArticleById,
	putArticleComment,
	getArticleComments,
	updateArticleVotes,
} = require("../controllers/articlesController");

articlesRouter.get("/", getArticles);

articlesRouter.get("/:article_id", getArticleById);

articlesRouter.get("/:article_id/comments", getArticleComments);

articlesRouter.patch("/:article_id", updateArticleVotes);

articlesRouter.post("/:article_id/comments", putArticleComment);

module.exports = articlesRouter;
