const db = require("../db/connection");

exports.fetchUsers = () => {
	return db
		.query(
			`SELECT *
		FROM users;`
		)
		.then(({ rows }) => {
			return rows;
		});
};

exports.fetchUserByUsername = (user_id, type = "user") => {
	return db
		.query(`SELECT * FROM users WHERE username = $1;`, [user_id])
		.then(({ rows, rowCount }) => {
			if (!rowCount) {
				return Promise.reject(`${type} not found`);
			}
			return rows[0];
		});
};
