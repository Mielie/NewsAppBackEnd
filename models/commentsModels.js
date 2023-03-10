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

exports.fetchArticleComments = (article_id, limit = "10", p = "0") => {
	let queryString = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`;

	const notANumber = /[^\0-9]/;
	if (limit.match(notANumber) || p.match(notANumber)) {
		return Promise.reject("invalid query");
	} else {
		queryString += ` LIMIT ${limit} OFFSET ${limit * p};`;
	}

	return db.query(queryString, [article_id]).then(({ rows, rowCount }) => {
		return rows;
	});
};

exports.newCommentForArticleWithId = (article_id, newComment) => {
	const comment = [
		newComment.body,
		newComment.author,
		newComment.votes,
		article_id,
	];

	return db
		.query(
			`INSERT INTO comments
		(body, author, votes, article_id)
		VALUES
		($1,$2,$3,$4)
		RETURNING *;`,
			comment
		)
		.then(({ rows }) => {
			return rows[0];
		});
};
