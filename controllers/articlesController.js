const {
	fetchArticles,
	fetchArticle,
	newCommentForArticleWithId,
	fetchArticleComments,
	selectArticleById,
	patchArticle,
	postArticle,
	checkTopic,
	countArticles,
	removeArticle,
} = require("../models/articlesModels");
const { fetchUserByUsername } = require("../models/usersModels");

exports.getArticles = (request, response, next) => {
	const { topic, author, sort_by, order, limit, p } = request.query;

	const promises = [];
	promises.push(countArticles(topic, author));
	promises.push(fetchArticles(topic, author, sort_by, order, limit, p));

	if (topic) {
		promises.push(checkTopic(topic));
	}

	if (author) {
		promises.push(fetchUserByUsername(author, "author"));
	}

	return Promise.all(promises)
		.then(([total_count, articles]) => {
			response.status(200).send({ total_count, articles });
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

	return newCommentForArticleWithId(article_id, newComment)
		.then((comment) => {
			response.status(201).send({ comment });
		})
		.catch(next);
};

exports.getArticleComments = (request, response, next) => {
	const { article_id } = request.params;
	const { limit, p } = request.query;
	const checkArticlePromise = fetchArticle(article_id);
	const fetchCommentsPromise = fetchArticleComments(article_id, limit, p);
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
		})
		.catch(next);
};

exports.putArticle = (request, response, next) => {
	const article = request.body;
	return postArticle(article)
		.then((article) => {
			response.status(201).send({ article });
		})
		.catch(next);
};

exports.deleteArticle = (request, response, next) => {
	const { article_id } = request.params;
	return removeArticle(article_id)
		.then(() => {
			response.status(204).send();
		})
		.catch(next);
};
