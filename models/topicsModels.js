const db = require("../db/connection");

exports.fetchTopics = () => {
	return db.query("SELECT * FROM topics;").then(({ rows }) => {
		return rows;
	});
};

exports.postTopic = (new_topic) => {
	const topic = [new_topic.slug, new_topic.description];
	return db
		.query(
			`INSERT INTO topics
		(slug, description)
		VALUES
		($1, $2)
		RETURNING *`,
			topic
		)
		.then(({ rows }) => {
			return rows[0];
		});
};
