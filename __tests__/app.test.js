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

		it("should return articles sorted by date descending", () => {
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
