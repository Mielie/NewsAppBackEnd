const apiRouter = require("express").Router();

const { getTopics } = require("../controllers/topicsController");
const { getApiEndpoints } = require("../controllers/apiController");
const articlesRouter = require("./articles-router");
const usersRouter = require("./users-router");
const commentsRouter = require("./comments-router");

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.get("/", getApiEndpoints);

apiRouter.get("/topics", getTopics);

module.exports = apiRouter;
