const db = require("../db/connection");

exports.fetchArticles = (topic, sort_by = "created_at", order = "desc") => {
	const validSortBy = {
		author: true,
		title: true,
		article_id: true,
		topic: true,
		created_at: true,
		votes: true,
		article_img_url: true,
		comment_count: true,
	};

	const validOrder = {
		asc: true,
		desc: true,
	};

	let queryString = `SELECT articles.author, articles.title, article_id,
			articles.topic, articles.created_at, articles.votes, 
			articles.article_img_url, COUNT(comments)::INT AS comment_count
		FROM articles 
		LEFT JOIN comments USING (article_id)`;

	const queryParams = [];

	if (topic) {
		queryString += ` WHERE topic = $1`;
		queryParams.push(topic);
	}

	queryString += ` GROUP BY articles.article_id
		ORDER BY `;

	if (validSortBy[sort_by]) {
		queryString += `${sort_by} `;
	} else {
		return Promise.reject("invalid query");
	}

	if (validOrder[order]) {
		queryString += `${order};`;
	} else {
		return Promise.reject("invalid query");
	}

	return db.query(queryString, queryParams).then(({ rows }) => {
		return rows;
	});
};

exports.fetchArticle = (article_id) => {
	return db
		.query(
			`SELECT articles.author, articles.title, article_id,
			articles.topic, articles.created_at, articles.votes, 
			articles.article_img_url, articles.body, COUNT(comments)::INT AS comment_count
		FROM articles 
		LEFT JOIN comments USING (article_id)
		WHERE article_id = $1
		GROUP BY article_id;`,
			[article_id]
		)
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

exports.patchArticle = (article_id, newVotes) => {
	return db
		.query(
			`UPDATE articles
		SET votes = $1
		WHERE article_id = $2
		RETURNING *;`,
			[newVotes, article_id]
		)
		.then(({ rows }) => {
			return rows[0];
		});
};

exports.checkTopic = (topic) => {
	return db
		.query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
		.then(({ rowCount }) => {
			if (!rowCount) {
				return Promise.reject("topic not found");
			}
			return true;
		});
};

exports.postArticle = (newArticle) => {
	const article = [
		newArticle.author,
		newArticle.title,
		newArticle.body,
		newArticle.topic,
		newArticle.article_img_url,
	];

	return db
		.query(
			`INSERT INTO articles
		(author, title, body, topic, article_img_url, votes)
		VALUES
		($1,$2,$3,$4,$5,0)
		RETURNING *;`,
			article
		)
		.then(({ rows }) => {
			return rows[0];
		});
};
