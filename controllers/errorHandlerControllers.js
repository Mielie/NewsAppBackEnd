exports.pathNotFoundHandler = (request, response, next) => {
	response.status(404).send({ msg: "Path not found" });
};

exports.sqlErrorHandler = (error, request, response, next) => {
	if (error.code === "22P02") {
		response.status(400).send({ msg: "invalid query" });
	} else if (error.code === "23502") {
		response.status(400).send({ msg: "missing parameter" });
	} else {
		next(error);
	}
};

exports.customErrorHandler = (error, request, response, next) => {
	let regEx = /not found$/i;
	if (regEx.test(error)) {
		response.status(404).send({ msg: error });
	} else if (error === "invalid query") {
		response.status(400).send({ msg: error });
	} else {
		next(error);
	}
};

exports.serverSideErrorHandler = (error, request, response, next) => {
	console.log(error, "<--- server side error handler");
	response.status(500).send(error);
};
