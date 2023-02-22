const { removeComment } = require("../models/commentsModels");

exports.deleteComment = (request, response, next) => {
	const { comment_id } = request.params;
	return removeComment(comment_id)
		.then(() => {
			response.status(204).send();
		})
		.catch(next);
};
