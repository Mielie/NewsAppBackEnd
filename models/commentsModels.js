const db = require("../db/connection");

exports.removeComment = (comment_id) => {
	return db
		.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
			comment_id,
		])
		.then(({ rowCount }) => {
			if (!rowCount) {
				return Promise.reject("comment not found");
			}
			return rowCount;
		});
};

exports.fetchComment = (comment_id) => {
	return db
		.query(`SELECT * FROM comments WHERE comment_id = $1;`, [comment_id])
		.then(({ rows, rowCount }) => {
			if (!rowCount) {
				return Promise.reject("comment not found");
			}
			return rows[0];
		});
};

exports.patchComment = (comment_id, newVotes) => {
	return db
		.query(
			`UPDATE comments
		SET votes = $1
		WHERE comment_id = $2
		RETURNING *;`,
			[newVotes, comment_id]
		)
		.then(({ rows }) => {
			return rows[0];
		});
};
