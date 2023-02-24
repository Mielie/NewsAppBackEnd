const { fetchTopics, postTopic } = require("../models/topicsModels.js");

exports.getTopics = (request, response, next) => {
	return fetchTopics()
		.then((topics) => {
			response.status(200).send({ topics });
		})
		.catch(next);
};

exports.newTopic = (request, response, next) => {
	const new_topic = request.body;
	return postTopic(new_topic)
		.then((topic) => {
			response.status(201).send({ topic });
		})
		.catch(next);
};
