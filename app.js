const express = require("express");

const {
    getArticles,
    getArticleById,
} = require("./controllers/articlesController");
const { getTopics } = require("./controllers/topicsController");

const {
    sqlErrorHandler,
    customErrorHandler,
} = require("./controllers/errorHandlerControllers");
const errorHandlers = [sqlErrorHandler, customErrorHandler];

const app = express();

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/topics", getTopics);

app.use(...errorHandlers);

module.exports = app;
