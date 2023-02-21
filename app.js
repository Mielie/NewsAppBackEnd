const express = require("express");

const {
    getArticles,
    getArticleById,
    getArticleComments,
    updateArticleVotes,
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

app.patch("/api/articles/:article_id", updateArticleVotes);

app.get("/api/topics", getTopics);

const errorHandlers = [
    pathNotFoundHandler,
    sqlErrorHandler,
    customErrorHandler,
    serverSideErrorHandler,
];
app.use(...errorHandlers);

module.exports = app;
