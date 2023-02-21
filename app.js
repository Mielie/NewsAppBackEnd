const express = require("express");

const {
    getArticles,
    getArticleById,
    getArticleComments,
} = require("./controllers/articlesController");
const { getTopics } = require("./controllers/topicsController");

const {
    sqlErrorHandler,
    customErrorHandler,
    pathNotFoundHandler,
} = require("./controllers/errorHandlerControllers");
const errorHandlers = [
    pathNotFoundHandler,
    sqlErrorHandler,
    customErrorHandler,
];

const app = express();

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.get("/api/topics", getTopics);

app.use(...errorHandlers);

module.exports = app;
