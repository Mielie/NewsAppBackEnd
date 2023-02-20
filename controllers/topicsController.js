const { fetchTopics } = require("../models/topicsModels.js");

exports.getTopics = (request, response) => {
	return fetchTopics().then((topics) => {
		response.status(200).send({ topics });
	});
};
