const db = require("../db/connection");

exports.fetchArticles = () => {
	return db
		.query(
			`SELECT articles.author, articles.title, article_id,
			articles.topic, articles.created_at, articles.votes, 
			articles.article_img_url, COUNT(comments) AS comment_count
		FROM articles 
		LEFT JOIN comments USING (article_id) 
		GROUP BY articles.article_id
		ORDER BY articles.created_at DESC;`
		)
		.then(({ rows }) => {
			return rows;
		});
};

exports.fetchArticle = (article_id) => {
	return db
		.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
		.then(({ rows, rowCount }) => {
			if (!rowCount) {
				return Promise.reject("article not found");
			}
			return rows[0];
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

exports.fetchArticleComments = (article_id) => {
	return db
		.query(
			`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
			[article_id]
		)
		.then(({ rows, rowCount }) => {
			return rows;
		});
};
