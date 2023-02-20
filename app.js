const express = require("express");
const { getArticles } = require("./controllers/articlesController");
//const { customErrorHandler } = require("./controllers/errorHandlerControllers");

const app = express();

app.use(express.json());

app.get("/api/articles", getArticles);

//app.use(customErrorHandler);

module.exports = app;
