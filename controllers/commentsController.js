const {
	removeComment,
	fetchComment,
	patchComment,
} = require("../models/commentsModels");

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
