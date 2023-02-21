const express = require("express");

const {
    getArticles,
    getArticleById,
    getArticleComments,
} = require("./controllers/articlesController");
const { getTopics } = require("./controllers/topicsController");
const { getUsers } = require("./controllers/usersController");

const {
    sqlErrorHandler,
    customErrorHandler,
    pathNotFoundHandler,
    serverSideErrorHandler,
} = require("./controllers/errorHandlerControllers");

const app = express();

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

const errorHandlers = [
    pathNotFoundHandler,
    sqlErrorHandler,
    customErrorHandler,
    serverSideErrorHandler,
];
app.use(...errorHandlers);

module.exports = app;
