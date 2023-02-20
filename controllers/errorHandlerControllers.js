exports.sqlErrorHandler = (error, request, response, next) => {
	if (error.code === "22P02") {
		response.status(400).send({ msg: "invalid query" });
	} else {
		next(error);
	}
};

exports.customErrorHandler = (error, request, response, next) => {
	if (error === "no content") {
		response.status(204).send();
	} else {
		console.log(error);
		response.status(500).send(error);
	}
};
