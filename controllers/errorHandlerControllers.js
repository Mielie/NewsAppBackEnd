exports.pathNotFoundHandler = (request, response, next) => {
	response.status(404).send({ msg: "Path not found" });
};

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
	} else if (error === "article not found") {
		response.status(404).send({ msg: error });
	} else {
		next(error);
	}
};

exports.serverSideErrorHandler = (error, request, response, next) => {
	console.log(error);
	response.status(500).send(error);
};
