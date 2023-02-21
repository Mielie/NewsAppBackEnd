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
	describe("GET: 204", () => {
		it("should return 204 if article is not in DB", () => {
			const article_id = 13;
			return request(app).get(`/api/articles/${article_id}`).expect(204);
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
		it("should add the comment to the comments table", () => {
			const article_id = 2;
			const new_comment = {
				body: "this is a new comment",
				author: "lurker",
				votes: 0,
			};
			return request(app)
				.post(`/api/articles/${article_id}/comments`)
				.send(new_comment)
				.expect(201)
				.then(() =>
					db
						.query(
							`SELECT * FROM comments WHERE article_id = ${article_id}`
						)
						.then(({ rows }) => {
							expect(rows).toHaveLength(1);
						})
				);
		});
	});
});
describe("invalid url", () => {
	it("should return 404 if url not valid", () => {
		return request(app).get("/api/nonsense").expect(404);
	});
});
