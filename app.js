const express = require("express");

const {
    getArticles,
    getArticleById,
    putArticleComment,
} = require("./controllers/articlesController");
const { getTopics } = require("./controllers/topicsController");

const {
    sqlErrorHandler,
    customErrorHandler,
} = require("./controllers/errorHandlerControllers");
const errorHandlers = [sqlErrorHandler, customErrorHandler];

const app = express();

app.use(express.json());

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/topics", getTopics);

app.post("/api/articles/:article_id/comments", putArticleComment);

app.use(...errorHandlers);

module.exports = app;
