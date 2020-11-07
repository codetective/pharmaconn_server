const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const Answer = require("../models/Answer");
const Questions = require("../models/Questions");
const Spaces = require("../models/Spaces");
const Topics = require("../models/Topics");
const User = require("../models/User");

router.get("/feed", auth, async (req, res) => {
  try {
    let topics = await Topics.find({
      followers: { $in: [res.locals.user.id] },
    });
    let userTopics = [];
    topics.forEach((t) => userTopics.push(t._id));
    console.log(userTopics);
    let answersFromTopics = await Answer.find({
      topics: { $in: userTopics },
    }).populate({
      path: "question topics user upvotes downvotes",
      select: "-password",
      populate: {
        path: "user",
        select: "-password",
      },
    });
    res.json({
      topicAnswers: answersFromTopics,
    });
  } catch (err) {
    res.status(400).json({ error: err.toString() });
  }
});

module.exports = router;
