const endpoints = require("../endpoints.json");

exports.getApiEndpoints = (request, response) => {
	response.status(200).send({ endpoints });
};
