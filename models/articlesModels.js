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
				return Promise.reject("no content");
			}
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
			if (!rowCount) {
				return Promise.reject("no content");
			}
			return rows;
		});
};
