const express = require("express");
//const { getTopics } = require("./controllers/topicsController");
const { getArticles } = require("./controllers/articlesController");

const { customErrorHandler } = require("./controllers/errorHandlerControllers");

const app = express();

//app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.use(customErrorHandler);

module.exports = app;
