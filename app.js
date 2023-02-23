const express = require("express");

const {
    getArticles,
    getArticleById,
    putArticleComment,
    getArticleComments,
    updateArticleVotes,
} = require("./controllers/articlesController");
const { getTopics } = require("./controllers/topicsController");
const { getUsers } = require("./controllers/usersController");
const { deleteComment } = require("./controllers/commentsController");
const { getApiEndpoints } = require("./controllers/apiController");

const {
    sqlErrorHandler,
    customErrorHandler,
    pathNotFoundHandler,
    serverSideErrorHandler,
} = require("./controllers/errorHandlerControllers");

const app = express();

app.use(express.json());

app.get("/api", getApiEndpoints);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.patch("/api/articles/:article_id", updateArticleVotes);

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", putArticleComment);

app.delete("/api/comments/:comment_id", deleteComment);

const errorHandlers = [
    pathNotFoundHandler,
    sqlErrorHandler,
    customErrorHandler,
    serverSideErrorHandler,
];

app.use(...errorHandlers);

module.exports = app;
