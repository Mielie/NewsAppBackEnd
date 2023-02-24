const app = require("../app");
const request = require("supertest");
const testData = require("../db/data/test-data/");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const endpointsJson = require("../endpoints.json");

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
	describe("POST: 201", () => {
		it("should return the newly created topic", () => {
			const new_topic = {
				slug: "newTopic",
				description: "This is a new topic",
			};
			return request(app)
				.post("/api/topics")
				.send(new_topic)
				.expect(201)
				.then(({ body }) => {
					const { topic } = body;
					expect(topic).toHaveProperty("slug", new_topic.slug);
					expect(topic).toHaveProperty(
						"description",
						new_topic.description
					);
				});
		});
		it("should ignore any superfluous keys", () => {
			const new_topic = {
				slug: "anotherNewTopic",
				description: "This is another new topic",
				unnecessary: "This key/value is superfluous",
			};
			return request(app)
				.post("/api/topics")
				.send(new_topic)
				.expect(201)
				.then(({ body }) => {
					const { topic } = body;
					expect(topic).not.toHaveProperty(
						"unnecessary",
						new_topic.unnecessary
					);
				});
		});
		it("should still create the topic even if no description is provided", () => {
			const new_topic = {
				slug: "yetAnotherNewTopic",
			};
			return request(app)
				.post("/api/topics")
				.send(new_topic)
				.expect(201)
				.then(({ body }) => {
					const { topic } = body;
					expect(topic).toHaveProperty("slug", new_topic.slug);
					expect(topic).toHaveProperty("description", null);
				});
		});
	});
	describe("POST: 400", () => {
		it("should return 400 if topic slug is already in use", () => {
			const new_topic = {
				slug: "newTopic",
				description: "This is a new topic",
			};
			return request(app)
				.post("/api/topics")
				.send(new_topic)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("entry already exists");
				});
		});
		it("should return 400 if no slug is provided", () => {
			const new_topic = {
				description: "This is a new topic",
			};
			return request(app)
				.post("/api/topics")
				.send(new_topic)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("missing parameter");
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
							expect.any(Number)
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

		it("should return an JSON object with a key of total_count that is the total number of articles matching any queries", () => {
			const limit = 5;
			return request(app)
				.get(`/api/articles?limit=${limit}`)
				.expect(200)
				.then(({ body }) => {
					const { total_count } = body;
					expect(total_count).toBe(12);
				});
		});

		it("should default to a limit of 10 articles", () => {
			return request(app)
				.get(`/api/articles`)
				.expect(200)
				.then(({ body }) => {
					const { articles } = body;
					expect(articles).toHaveLength(10);
				});
		});

		it("should accept a query limit and return the correct number of articles", () => {
			const limit = 5;
			return request(app)
				.get(`/api/articles?limit=${limit}`)
				.expect(200)
				.then(({ body }) => {
					const { articles } = body;
					expect(articles).toHaveLength(5);
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

		it("should start at the first page by default", () => {
			return request(app)
				.get(`/api/articles?sort_by=article_id&order=asc`)
				.expect(200)
				.then(({ body }) => {
					const { articles } = body;
					expect(articles[0].article_id).toBe(1);
				});
		});

		it("should start at the correct point when a page number is provided", () => {
			const page = 1;
			return request(app)
				.get(
					`/api/articles?sort_by=article_id&order=asc&limit=4&p=${page}`
				)
				.expect(200)
				.then(({ body }) => {
					const { articles } = body;
					expect(articles[0].article_id).toBe(5);
				});
		});

		it("should return an empty array when page is too high", () => {
			const page = 3;
			return request(app)
				.get(
					`/api/articles?sort_by=article_id&order=asc&limit=4&p=${page}`
				)
				.expect(200)
				.then(({ body }) => {
					const { articles, total_count } = body;
					expect(articles).toHaveLength(0);
					expect(total_count).toBe(12);
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
		it("should return 400 when passed a limit that is not a number", () => {
			const limit = "hello";
			return request(app)
				.get(`/api/articles?limit=${limit}`)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("invalid query");
				});
		});
		it("should return 400 when passed a page that is not a number", () => {
			const page = "hello";
			return request(app)
				.get(`/api/articles?p=${page}`)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("invalid query");
				});
		});
	});
	describe("POST: 201", () => {
		it("should return 201 and the newly created article", () => {
			const new_article = {
				author: "icellusedkars",
				title: "A new article",
				body: "This is an exciting new article!",
				topic: "mitch",
				article_img_url: "https://a.url.com",
			};
			return request(app)
				.post("/api/articles")
				.send(new_article)
				.expect(201)
				.then(({ body }) => {
					const { article } = body;
					expect(article).toHaveProperty("article_id", 13);
					expect(article).toHaveProperty("title", new_article.title);
					expect(article).toHaveProperty("topic", new_article.topic);
					expect(article).toHaveProperty(
						"author",
						new_article.author
					);
					expect(article).toHaveProperty("body", new_article.body);
					expect(article).toHaveProperty(
						"created_at",
						expect.any(String)
					);
					expect(article).toHaveProperty("votes", 0);
					expect(article).toHaveProperty(
						"article_img_url",
						new_article.article_img_url
					);
				});
		});
		it("should return 201 and ignore superfluous keys", () => {
			const new_article = {
				author: "icellusedkars",
				title: "Another new article",
				body: "This is another exciting new article!",
				unnecessary: "this key is not superfluous",
				topic: "mitch",
				article_img_url: "https://a.url.com",
			};
			return request(app)
				.post("/api/articles")
				.send(new_article)
				.expect(201)
				.then(({ body }) => {
					const { article } = body;
					expect(article).not.toHaveProperty(
						"unnecessary",
						"this key is not superfluous"
					);
				});
		});
	});
	describe("POST: 404", () => {
		it("should return 404 if author does not exist", () => {
			const new_article = {
				author: "author does not exist",
				title: "A new article",
				body: "This is an exciting new article!",
				topic: "mitch",
				article_img_url: "https://a.url.com",
			};
			return request(app)
				.post("/api/articles")
				.send(new_article)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("author not found");
				});
		});
		it("should return 404 if topic does not exist", () => {
			const new_article = {
				author: "icellusedkars",
				title: "A new article",
				body: "This is an exciting new article!",
				topic: "dogs",
				article_img_url: "https://a.url.com",
			};
			return request(app)
				.post("/api/articles")
				.send(new_article)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("topic not found");
				});
		});
		describe("POST: 400", () => {
			it("should return 400 if object is missing essential keys", () => {
				const new_article = {
					author: "icellusedkars",
					title: "A new article",
					topic: "mitch",
					article_img_url: "https://a.url.com",
				};
				return request(app)
					.post("/api/articles")
					.send(new_article)
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("missing parameter");
					});
			});
			it("should return 400 if object if essential keys are null", () => {
				const new_article = {
					author: "icellusedkars",
					title: "A new article",
					body: null,
					topic: "mitch",
					article_img_url: "https://a.url.com",
				};
				return request(app)
					.post("/api/articles")
					.send(new_article)
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe("missing parameter");
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
					expect(article).toHaveProperty(
						"comment_count",
						expect.any(Number)
					);
				});
		});
		it("should return an article with the correct comment_count", () => {
			const article_id = 1;
			return request(app)
				.get(`/api/articles/${article_id}`)
				.expect(200)
				.then(({ body }) => {
					const { article } = body;
					expect(article).toHaveProperty("comment_count", 11);
				});
		});
	});
	describe("GET: 404", () => {
		it("should return 404 if article is not in DB", () => {
			const article_id = 100;
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
			const article_id = 100;
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
					expect(comments).toHaveLength(10);
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
		it("should default to returning 10 comments", () => {
			const article_id = 1;
			return request(app)
				.get(`/api/articles/${article_id}/comments`)
				.expect(200)
				.then(({ body }) => {
					const { comments } = body;
					expect(comments).toHaveLength(10);
				});
		});
		it("should accept a limit query and return the correct number of comments", () => {
			const article_id = 1;
			const limit = 4;
			return request(app)
				.get(`/api/articles/${article_id}/comments?limit=${limit}`)
				.expect(200)
				.then(({ body }) => {
					const { comments } = body;
					expect(comments).toHaveLength(limit);
				});
		});
		it("should default to returning the first page", () => {
			const article_id = 1;
			return request(app)
				.get(`/api/articles/${article_id}/comments`)
				.expect(200)
				.then(({ body }) => {
					const { comments } = body;
					expect(comments[0].comment_id).toBe(5);
				});
		});
		it("should return the correct page when a page query is passed", () => {
			const article_id = 1;
			const limit = 4;
			const page = 1;
			return request(app)
				.get(
					`/api/articles/${article_id}/comments?limit=${limit}&p=${page}`
				)
				.expect(200)
				.then(({ body }) => {
					const { comments } = body;
					expect(comments[0].comment_id).toBe(7);
				});
		});
		it("should return an empty array when page is too high", () => {
			const article_id = 1;
			const limit = 4;
			const page = 4;
			return request(app)
				.get(
					`/api/articles/${article_id}/comments?limit=${limit}&p=${page}`
				)
				.expect(200)
				.then(({ body }) => {
					const { comments } = body;
					expect(comments).toHaveLength(0);
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
			const article_id = 100;
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
		it("should return 400 if limit query is not a number", () => {
			const article_id = 1;
			const limit = "hello";
			return request(app)
				.get(`/api/articles/${article_id}/comments?limit=${limit}`)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("invalid query");
				});
		});
		it("should return 400 if page query is not a number", () => {
			const article_id = 1;
			const page = "hello";
			return request(app)
				.get(`/api/articles/${article_id}/comments?p=${page}`)
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
			const article_id = 100;
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
					expect(msg).toBe("article_id not found");
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
					expect(msg).toBe("author not found");
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

describe("/api/users/:username", () => {
	describe("GET: 200", () => {
		it("should return 200 and a user object when queried with an existing username", () => {
			const username = "rogersop";
			return request(app)
				.get(`/api/users/${username}`)
				.expect(200)
				.then(({ body }) => {
					const { user } = body;
					expect(user).toHaveProperty("username", "rogersop");
					expect(user).toHaveProperty("name", "paul");
					expect(user).toHaveProperty(
						"avatar_url",
						"https://avatars2.githubusercontent.com/u/24394918?s=400&v=4"
					);
				});
		});
	});
	describe("GET: 404", () => {
		it("should return 404 when queried with a username that does not exist", () => {
			const username = "invalid_username";
			return request(app)
				.get(`/api/users/${username}`)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("user not found");
				});
		});
	});
});

describe("/api/comments/:comment_id", () => {
	describe("DELETE: 204", () => {
		it("should return 204 and no content when passed a valid comment_id", () => {
			const comment_id = 1;
			return request(app)
				.delete(`/api/comments/${comment_id}`)
				.expect(204)
				.then(({ body }) => {
					expect(body).toEqual({});
				});
		});
	});
	describe("DELETE: 400", () => {
		it("should return 400 if user passes a comment_id that is not a number", () => {
			const comment_id = "not_a_number";
			return request(app)
				.delete(`/api/comments/${comment_id}`)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("invalid query");
				});
		});
	});
	describe("DELETE: 404", () => {
		it("should return 404 if user passes a comment_id that is valid but does not exist", () => {
			const comment_id = 200;
			return request(app)
				.delete(`/api/comments/${comment_id}`)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("comment not found");
				});
		});
	});
	describe("PATCH: 200", () => {
		it("should return 200 with the updated comment", () => {
			const comment_id = 2;
			const update = { inc_votes: -1 };
			return request(app)
				.patch(`/api/comments/${comment_id}`)
				.send(update)
				.expect(200)
				.then(({ body }) => {
					const { comment } = body;
					expect(comment).toHaveProperty("votes", 13);
				});
		});
		it("should ignore any additional keys passed", () => {
			const comment_id = 2;
			const update = { inc_votes: -1, extra_parameter: "not included" };
			return request(app)
				.patch(`/api/comments/${comment_id}`)
				.send(update)
				.expect(200)
				.then(({ body }) => {
					const { comment } = body;
					expect(comment).not.toHaveProperty(
						"extra_parameter",
						"not included"
					);
				});
		});
	});
	describe("PATCH: 404", () => {
		it("should return 404 when trying to patch a comment that does not exist", () => {
			const comment_id = 21;
			const update = { inc_votes: -1 };
			return request(app)
				.patch(`/api/comments/${comment_id}`)
				.send(update)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("comment not found");
				});
		});
	});
	describe("PATCH: 400", () => {
		it("should return 400 when trying to patch with a comment_id that is not a number", () => {
			const comment_id = "invalid comment_id";
			const update = { inc_votes: -1 };
			return request(app)
				.patch(`/api/comments/${comment_id}`)
				.send(update)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("invalid query");
				});
		});
		it("should return 400 if user does not pass an object with a inc_votes key", () => {
			const comment_id = 2;
			const update = { add_votes: -1 };
			return request(app)
				.patch(`/api/comments/${comment_id}`)
				.send(update)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("invalid query");
				});
		});
		it("should return 400 if user does not pass an object", () => {
			const comment_id = 2;
			const update = "invalid query parameter";
			return request(app)
				.patch(`/api/comments/${comment_id}`)
				.send(update)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("invalid query");
				});
		});
		it("should return 400 if user passes an object with a value for the inc_votes key that is not a number", () => {
			const comment_id = 2;
			const update = { add_votes: "one" };
			return request(app)
				.patch(`/api/comments/${comment_id}`)
				.send(update)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe("invalid query");
				});
		});
	});
});

describe("/api", () => {
	describe("GET: 200", () => {
		it("should return the endpoints.json with a code of 200", () => {
			return request(app)
				.get("/api")
				.expect(200)
				.then(({ body }) => {
					const { endpoints } = body;
					expect(endpoints).toEqual(endpointsJson);
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
