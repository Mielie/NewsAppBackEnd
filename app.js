const express = require("express");

const {
    sqlErrorHandler,
    customErrorHandler,
    pathNotFoundHandler,
    serverSideErrorHandler,
} = require("./controllers/errorHandlerControllers");

const apiRouter = require("./routes/api-router");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

const errorHandlers = [
    pathNotFoundHandler,
    sqlErrorHandler,
    customErrorHandler,
    serverSideErrorHandler,
];

app.use(...errorHandlers);

module.exports = app;
