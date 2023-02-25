const {
	removeComment,
	fetchComment,
	patchComment,
	fetchArticleComments,
	newCommentForArticleWithId,
} = require("../models/commentsModels");
const { fetchArticle } = require("../models/articlesModels");

exports.deleteComment = (request, response, next) => {
	const { comment_id } = request.params;
	return removeComment(comment_id)
		.then(() => {
			response.status(204).send();
		})
		.catch(next);
};

exports.updateCommentVotes = (request, response, next) => {
	const { comment_id } = request.params;
	const update = request.body;
	return fetchComment(comment_id)
		.then((comment) => (comment.votes += update.inc_votes))
		.then((newVotes) => patchComment(comment_id, newVotes))
		.then((comment) => {
			return response.status(200).send({ comment });
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

exports.putArticleComment = (request, response, next) => {
	const { article_id } = request.params;
	const newComment = request.body;

	return newCommentForArticleWithId(article_id, newComment)
		.then((comment) => {
			response.status(201).send({ comment });
		})
		.catch(next);
};
