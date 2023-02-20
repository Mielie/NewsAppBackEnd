const { fetchArticles } = require("../models/articlesModels");

exports.getArticles = (request, response) => {
	return fetchArticles().then((articles) => {
		response.status(200).send({ articles });
	});
};
