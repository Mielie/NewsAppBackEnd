const {
	fetchArticles,
	fetchArticle,
	fetchArticleComments,
	selectArticleById,
	patchArticle,
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

exports.updateArticleVotes = (request, response, next) => {
	const { article_id } = request.params;
	const update = request.body;
	return fetchArticle(article_id)
		.then((article) => (article.votes += update.inc_votes))
		.then((newVotes) => patchArticle(article_id, newVotes))
		.then((article) => {
			return response.status(200).send({ article });
		});
};
