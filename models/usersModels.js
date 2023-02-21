const db = require("../db/connection");

exports.fetchUserById = (user_id) => {
	return db
		.query(`SELECT * FROM users WHERE username = $1;`, [user_id])
		.then(({ rows, rowCount }) => {
			if (!rowCount) {
				return Promise.reject("user not found");
			}
			return rows[0];
		});
};
