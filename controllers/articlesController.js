const {
	fetchArticles,
	fetchArticle,
	newCommentForArticleWithId,
} = require("../models/articlesModels");

exports.getArticles = (request, response, next) => {
	return fetchArticles()
		.then((articles) => {
			response.status(200).send({ articles });
		})
		.catch(next);
};

exports.getArticleById = (request, response, next) => {
	const { article_id } = request.params;
	return fetchArticle(article_id)
		.then((article) => {
			response.status(200).send({ article });
		})
		.catch(next);
};

exports.putArticleComment = (request, response, next) => {
	const { article_id } = request.params;
	const newComment = request.body;

	return newCommentForArticleWithId(article_id, newComment).then(
		(comment) => {
			response.status(201).send({ comment });
		}
	);
};
