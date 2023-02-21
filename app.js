const express = require("express");

const {
    getArticles,
    getArticleById,
    putArticleComment,
    getArticleComments,
} = require("./controllers/articlesController");
const { getTopics } = require("./controllers/topicsController");

const {
    sqlErrorHandler,
    customErrorHandler,
    pathNotFoundHandler,
    serverSideErrorHandler,
} = require("./controllers/errorHandlerControllers");

const app = express();

app.use(express.json());

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.get("/api/topics", getTopics);

app.post("/api/articles/:article_id/comments", putArticleComment);

const errorHandlers = [
    pathNotFoundHandler,
    sqlErrorHandler,
    customErrorHandler,
    serverSideErrorHandler,
];

app.use(...errorHandlers);

module.exports = app;
