const express = require("express");
const { getTopics } = require("./controllers/topicsController");
const { customErrorHandler } = require("./controllers/errorHandlerControllers");

const app = express();

app.get("/api/topics", getTopics);

app.use(customErrorHandler);

module.exports = app;
