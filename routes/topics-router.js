const topicsRouter = require("express").Router();

const { getTopics, newTopic } = require("../controllers/topicsController");

topicsRouter.get("/", getTopics);

topicsRouter.post("/", newTopic);

module.exports = topicsRouter;
