const express = require("express");
const cors = require("cors");

const {
    sqlErrorHandler,
    customErrorHandler,
    pathNotFoundHandler,
    serverSideErrorHandler,
} = require("./controllers/errorHandlerControllers");

const apiRouter = require("./routes/api-router");

const app = express();

app.use(cors);

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
