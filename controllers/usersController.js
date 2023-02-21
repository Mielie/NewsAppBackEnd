const { fetchUsers } = require("../models/usersModels");

exports.getUsers = (request, response, next) => {
	return fetchUsers()
		.then((users) => {
			response.status(200).send({ users });
		})
		.catch(next);
};
