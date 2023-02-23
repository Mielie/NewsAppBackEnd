const apiRouter = require("express").Router();

const { getTopics } = require("../controllers/topicsController");
const { deleteComment } = require("../controllers/commentsController");
const { getApiEndpoints } = require("../controllers/apiController");
const articlesRouter = require("./articles-router");
const usersRouter = require("./users-router");

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/users", usersRouter);

apiRouter.get("/", getApiEndpoints);

apiRouter.get("/topics", getTopics);

apiRouter.delete("/comments/:comment_id", deleteComment);

module.exports = apiRouter;
