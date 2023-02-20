exports.customErrorHandler = (error, request, response, next) => {
	if (error === "query returned no results") {
		response.status(204).send();
	}

	next(error);
};
