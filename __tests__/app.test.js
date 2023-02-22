const app = require("../app");
const request = require("supertest");
const testData = require("../db/data/test-data/");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

beforeAll(() => seed(testData));

afterAll(() => db.end());

describe("/api/topics", () => {
	describe("GET: 200", () => {
		it("should return a 200 code and an array of topics", () => {
			return request(app)
				.get("/api/topics")
				.expect(200)
				.then(({ body }) => {
					const { topics } = body;
					expect(topics).toBeInstanceOf(Array);
					expect(topics).toHaveLength(3);
					topics.forEach((topic) => {
						expect(topic).toHaveProperty(
							"slug",
							expect.any(String)
						);
						expect(topic).toHaveProperty(
							"description",
							expect.any(String)
						);
					});
				});
		});
	});
});

describe("/api/articles", () => {
	describe("GET: 200", () => {
		it("should return a 200 code and an array of articles", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body }) => {
					const { articles } = body;
					expect(articles).toBeInstanceOf(Array);
					expect(articles).toHaveLength(12);
					articles.forEach((article) => {
						expect(article).toHaveProperty(
							"author",
							expect.any(String)
						);
						expect(article).toHaveProperty(
							"title",
							expect.any(String)
						);
						expect(article).toHaveProperty(
							"article_id",
							expect.any(Number)
						);
						expect(article).toHaveProperty(
							"topic",
							expect.any(String)
						);
						expect(article).toHaveProperty(
							"created_at",
							expect.any(String)
						);
						expect(article).toHaveProperty(
							"votes",
							expect.any(Number)
						);
						expect(article).toHaveProperty(
							"article_img_url",
							expect.any(String)
						);
						expect(article).toHaveProperty(
							"comment_count",
							expect.any(String)
						);
					});
				});
		});

		it("should return articles filtered by topic", () => {
			const topic = "cats";
			return request(app)
				.get(`/api/articles?topic=${topic}`)
				.expect(200)
				.then(({ body }) => {
					const { articles } = body;
					expect(articles).toHaveLength(1);
					expect(articles[0]).toHaveProperty("topic", topic);
				});
		});

		it("should return an empty array when filtered by a valid topic where no articles have that topic", () => {
			const topic = "paper";
			return request(app)
				.get(`/api/articles?topic=${topic}`)
				.expect(200)
				.then(({ body }) => {
					const { articles } = body;
					expect(articles).toHaveLength(0);
				});
		});

		it("should default return articles sorted by date descending", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body }) => {
					const { articles } = body;
					expect(articles).toBeSortedBy("created_at", {
						descending: true,
					});
				});
		});

		it("should return articles sorted in ascending order when queried", () => {
			return request(app)
				.get("/api/articles/?order=asc")
				.expect(200)
				.then(({ body }) => {
					const { articles } = body;
					expect(articles).toBeSortedBy("created_at", {
						descending: false,
					});
				});
		});

		it("should return articles sorted by queried column", () => {
			return request(app)
				.get("/api/articles?sort_by=comment_count&order=asc")
				.expect(200)
				.then(({ body }) => {
					const { articles } = body;
					expect(articles).toBeSortedBy("comment_count", {
						descending: false,
						coerce: true,
					});
				});
		});

		it("should ignore invalid query items", () => {
			return request(app)
				.get(`/api/articles?invalid_query=true`)
				.expect(200)
				.then(({ body }) => {
					const { articles } = body;
					expect(articles).toBeInstanceOf(Array);
				});
		});
	});
	describe("GET 404", () => {
		it("should return 404 when passed a topic that does not exist", () => {
			const topic = "dogs";
			return request(app)
				.get(`/api/articles?topic=${topic}`)
				.expect(404)
				.then(({ body }) => {
					const { msg } = body;
					expect(msg).toBe("topic not found");
				});
		});
	});
	describe("GET 400", () => {
		it("should return 400 when passed a column to sort by that does not exist", () => {
			return request(app)
				.get("/api/articles?sort_by=text")
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("invalid query");
				});
		});
		it("should return 400 when passed an order that is neither asc or desc", () => {
			return request(app)
				.get("/api/articles?order=text")
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("invalid query");
				});
		});
	});
});

describe("/api/articles/:article_id", () => {
	describe("GET: 200", () => {
		it("should return a single article with correct id", () => {
			const article_id = 1;
			return request(app)
				.get(`/api/articles/${article_id}`)
				.expect(200)
				.then(({ body }) => {
					const { article } = body;
					expect(article).toHaveProperty("article_id", article_id);
					expect(article).toHaveProperty(
						"author",
						expect.any(String)
					);
					expect(article).toHaveProperty("title", expect.any(String));
					expect(article).toHaveProperty("body", expect.any(String));
					expect(article).toHaveProperty("topic", expect.any(String));
					expect(article).toHaveProperty(
						"created_at",
						expect.any(String)
					);
					expect(article).toHaveProperty("votes", expect.any(Number));
					expect(article).toHaveProperty(
						"article_img_url",
						expect.any(String)
					);
				});
		});
	});
	describe("GET: 404", () => {
		it("should return 404 if article is not in DB", () => {
			const article_id = 13;
			return request(app)
				.get(`/api/articles/${article_id}`)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("article not found");
				});
		});
	});
	describe("GET: 400", () => {
		it("should return 400 if article_id is not a number", () => {
			const article_id = "invalid_id";
			return request(app)
				.get(`/api/articles/${article_id}`)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("invalid query");
				});
		});
	});
	describe("PATCH: 200", () => {
		it("should return 200 with the updated article", () => {
			const article_id = 1;
			const update = { inc_votes: -1 };
			return request(app)
				.patch(`/api/articles/${article_id}`)
				.send(update)
				.expect(200)
				.then(({ body }) => {
					const { article } = body;
					expect(article).toHaveProperty("votes", 99);
				});
		});
		it("should ignore any additional keys passed", () => {
			const article_id = 1;
			const update = { inc_votes: -1, extra_parameter: "not included" };
			return request(app)
				.patch(`/api/articles/${article_id}`)
				.send(update)
				.expect(200)
				.then(({ body }) => {
					const { article } = body;
					expect(article).not.toHaveProperty(
						"extra_parameter",
						"not included"
					);
				});
		});
	});
	describe("PATCH: 404", () => {
		it("should return 404 when trying to patch an article that does not exist", () => {
			const article_id = 13;
			const update = { inc_votes: -1 };
			return request(app)
				.patch(`/api/articles/${article_id}`)
				.send(update)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("article not found");
				});
		});
	});
	describe("PATCH: 400", () => {
		it("should return 400 when trying to patch with an article_id that is not a number", () => {
			const article_id = "invalid article_id";
			const update = { inc_votes: -1 };
			return request(app)
				.patch(`/api/articles/${article_id}`)
				.send(update)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("invalid query");
				});
		});
		it("should return 400 if user does not pass an object with a inc_votes key", () => {
			const article_id = 1;
			const update = { add_votes: -1 };
			return request(app)
				.patch(`/api/articles/${article_id}`)
				.send(update)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("invalid query");
				});
		});
		it("should return 400 if user does not pass an object", () => {
			const article_id = 1;
			const update = "invalid query parameter";
			return request(app)
				.patch(`/api/articles/${article_id}`)
				.send(update)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("invalid query");
				});
		});
		it("should return 400 if user passes an object with a value for the inc_votes key that is not a number", () => {
			const article_id = 1;
			const update = { add_votes: "one" };
			return request(app)
				.patch(`/api/articles/${article_id}`)
				.send(update)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("invalid query");
				});
		});
	});
});

describe("/api/articles/:article_id/comments", () => {
	describe("GET: 200", () => {
		it("should return an array of comments for the given article", () => {
			const article_id = 1;
			return request(app)
				.get(`/api/articles/${article_id}/comments`)
				.expect(200)
				.then(({ body }) => {
					const { comments } = body;
					expect(comments).toHaveLength(11);
					comments.forEach((comment) => {
						expect(comment).toHaveProperty(
							"comment_id",
							expect.any(Number)
						);
						expect(comment).toHaveProperty(
							"votes",
							expect.any(Number)
						);
						expect(comment).toHaveProperty(
							"created_at",
							expect.any(String)
						);
						expect(comment).toHaveProperty(
							"author",
							expect.any(String)
						);
						expect(comment).toHaveProperty(
							"body",
							expect.any(String)
						);
						expect(comment).toHaveProperty(
							"article_id",
							expect.any(Number)
						);
					});
				});
		});
		it("should return comments most recent first", () => {
			const article_id = 1;
			return request(app)
				.get(`/api/articles/${article_id}/comments`)
				.expect(200)
				.then(({ body }) => {
					const { comments } = body;
					expect(comments).toBeSortedBy("created_at", {
						descending: true,
					});
				});
		});
		it("should return 200 if article exists but has no comments", () => {
			const article_id = 2;
			return request(app)
				.get(`/api/articles/${article_id}/comments`)
				.expect(200)
				.then(({ body }) => {
					expect(body.comments).toHaveLength(0);
				});
		});
	});

	describe("GET: 404", () => {
		it("should return 404 if article does not exist with article_id", () => {
			const article_id = 13;
			return request(app)
				.get(`/api/articles/${article_id}/comments`)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("article not found");
				});
		});
	});

	describe("GET: 400", () => {
		it("should return 400 if article id is not a number", () => {
			const article_id = "invalid_id";
			return request(app)
				.get(`/api/articles/${article_id}/comments`)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("invalid query");
				});
		});
	});

	describe("POST: 201", () => {
		it("should respond with a 201 and the newly created comment object", () => {
			const article_id = 1;
			const new_comment = {
				body: "this is a new comment",
				author: "lurker",
				votes: 0,
			};
			return request(app)
				.post(`/api/articles/${article_id}/comments`)
				.send(new_comment)
				.expect(201)
				.then(({ body }) => {
					const { comment } = body;
					expect(comment).toHaveProperty(
						"body",
						"this is a new comment"
					);
					expect(comment).toHaveProperty("author", "lurker");
					expect(comment).toHaveProperty("votes", 0);
					expect(comment).toHaveProperty("article_id", article_id);
					expect(comment).toHaveProperty(
						"comment_id",
						expect.any(Number)
					);
					expect(comment).toHaveProperty(
						"created_at",
						expect.any(String)
					);
				});
		});
		it("should ignore superfluous keys passed by the user", () => {
			const article_id = 1;
			const new_comment = {
				body: "this is a new comment",
				author: "lurker",
				extra_parameter: "this is unnecessary",
				votes: 0,
			};
			return request(app)
				.post(`/api/articles/${article_id}/comments`)
				.send(new_comment)
				.expect(201)
				.then(({ body }) => {
					const { comment } = body;
					expect(comment).toHaveProperty(
						"body",
						"this is a new comment"
					);
					expect(comment).not.toHaveProperty(
						"extra_parameter",
						"this is unncessary"
					);
				});
		});
	});

	describe("POST: 404", () => {
		it("should return 404 if article_id does not exist", () => {
			const article_id = 13;
			const new_comment = {
				body: "this is a new comment",
				author: "lurker",
				votes: 0,
			};
			return request(app)
				.post(`/api/articles/${article_id}/comments`)
				.send(new_comment)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("article not found");
				});
		});
		it("should return 404 if author (user) in comment does not exist", () => {
			const article_id = 1;
			const new_comment = {
				body: "this is a new comment",
				author: "author does not exist",
				votes: 0,
			};
			return request(app)
				.post(`/api/articles/${article_id}/comments`)
				.send(new_comment)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("user not found");
				});
		});
	});

	describe("POST: 400", () => {
		it("should return 400 if article_id is not a number", () => {
			const article_id = "invalid_id";
			const new_comment = {
				body: "this is a new comment",
				author: "lurker",
				votes: 0,
			};
			return request(app)
				.post(`/api/articles/${article_id}/comments`)
				.send(new_comment)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("invalid query");
				});
		});
		it("should return 400 if comment is missing necessary keys", () => {
			const article_id = 1;
			const new_comment = {
				author: "lurker",
				votes: 0,
			};
			return request(app)
				.post(`/api/articles/${article_id}/comments`)
				.send(new_comment)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("missing parameter");
				});
		});
	});
});

describe("/api/users", () => {
	describe("GET: 200", () => {
		it("should return 200 and an array of users", () => {
			return request(app)
				.get("/api/users")
				.expect(200)
				.then(({ body }) => {
					const { users } = body;
					expect(users).toHaveLength(4);
					users.forEach((user) => {
						expect(user).toHaveProperty(
							"username",
							expect.any(String)
						);
						expect(user).toHaveProperty("name", expect.any(String));
						expect(user).toHaveProperty(
							"avatar_url",
							expect.any(String)
						);
					});
				});
		});
	});
});

describe("invalid url", () => {
	it("should return 404 if url not valid", () => {
		return request(app)
			.get("/api/nonsense")
			.expect(404)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toBe("Path not found");
			});
	});
});
