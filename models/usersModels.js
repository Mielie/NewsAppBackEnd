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

exports.fetchUserByUsername = (user_id) => {
	return db
		.query(`SELECT * FROM users WHERE username = $1;`, [user_id])
		.then(({ rows, rowCount }) => {
			if (!rowCount) {
				return Promise.reject("user not found");
			}
			return rows[0];
		});
};
