const {
	fetchArticles,
	fetchArticle,
	newCommentForArticleWithId,
	fetchArticleComments,
} = require("../models/articlesModels");
const { fetchUserById } = require("../models/usersModels");

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

	return fetchArticle(article_id)
		.then(() => fetchUserById(newComment.author))
		.then(() => newCommentForArticleWithId(article_id, newComment))
		.then((comment) => {
			response.status(201).send({ comment });
		})
		.catch(next);
};

exports.getArticleComments = (request, response, next) => {
	const { article_id } = request.params;
	const checkArticlePromise = fetchArticle(article_id);
	const fetchCommentsPromise = fetchArticleComments(article_id);
	return Promise.all([fetchCommentsPromise, checkArticlePromise])
		.then(([comments]) => {
			response.status(200).send({ comments });
		})
		.catch(next);
};
