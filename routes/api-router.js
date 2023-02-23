const apiRouter = require("express").Router();

const { getTopics } = require("../controllers/topicsController");
const { getUsers } = require("../controllers/usersController");
const { deleteComment } = require("../controllers/commentsController");
const { getApiEndpoints } = require("../controllers/apiController");
const articlesRouter = require("./articles-router");

apiRouter.use("/articles", articlesRouter);

apiRouter.get("/", getApiEndpoints);

apiRouter.get("/topics", getTopics);

apiRouter.get("/users", getUsers);

apiRouter.delete("/comments/:comment_id", deleteComment);

module.exports = apiRouter;
