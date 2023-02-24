const apiRouter = require("express").Router();

const { getApiEndpoints } = require("../controllers/apiController");
const articlesRouter = require("./articles-router");
const usersRouter = require("./users-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.get("/", getApiEndpoints);

module.exports = apiRouter;
