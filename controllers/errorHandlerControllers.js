exports.customErrorHandler = (error, request, response, next) => {
	if (error === "query returned no results") {
		response.status(204).send();
	} else {
		console.log(error);
		response.status(500).send(error);
	}
};
