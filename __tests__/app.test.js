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
	describe("GET: 204", () => {
		it("should return 204 if no topics in database", () => {
			return db.query("DELETE FROM topics;").then(() => {
				return request(app).get("/api/topics").expect(204);
			});
		});
	});
});

describe("invalid url", () => {
	it("should return 404 if url not valid", () => {
		return request(app).get("/api/nonsense").expect(404);
	});
});
