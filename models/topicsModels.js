const db = require("../db/connection");

exports.fetchTopics = () => {
	return db.query("SELECT * FROM topics;").then(({ rows, rowCount }) => {
		if (!rowCount) {
			return Promise.reject("query returned no results");
		}
		return rows;
	});
};
