const { fetchTopics } = require("../models/topicsModels.js");

exports.getTopics = (request, response, next) => {
	return fetchTopics()
		.then((topics) => {
			response.status(200).send({ topics });
		})
		.catch(next);
};
