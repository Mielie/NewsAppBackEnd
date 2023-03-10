const articlesRouter = require("express").Router();

const {
	getArticles,
	getArticleById,
	putArticle,
	updateArticleVotes,
	deleteArticle,
} = require("../controllers/articlesController");
const {
	putArticleComment,
	getArticleComments,
} = require("../controllers/commentsController");

articlesRouter.get("/", getArticles);

articlesRouter.get("/:article_id", getArticleById);

articlesRouter.get("/:article_id/comments", getArticleComments);

articlesRouter.patch("/:article_id", updateArticleVotes);

articlesRouter.post("/:article_id/comments", putArticleComment);

articlesRouter.post("/", putArticle);

articlesRouter.delete("/:article_id", deleteArticle);

module.exports = articlesRouter;
