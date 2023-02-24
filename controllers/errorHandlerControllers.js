exports.pathNotFoundHandler = (request, response, next) => {
	response.status(404).send({ msg: "Path not found" });
};

exports.sqlErrorHandler = (error, request, response, next) => {
	if (error.code === "22P02") {
		response.status(400).send({ msg: "invalid query" });
	} else if (error.code === "23502") {
		response.status(400).send({ msg: "missing parameter" });
	} else if (error.code === "23505") {
		response.status(400).send({ msg: "entry already exists" });
	} else if (error.code === "23503") {
		const regEx = /(?<=Key \()\w*(?=\))/i;
		const key = error.detail.match(regEx)[0];
		response.status(404).send({ msg: `${key} not found` });
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
	console.log(error);
	response.status(500).send(error);
};
