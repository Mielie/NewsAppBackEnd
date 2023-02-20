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