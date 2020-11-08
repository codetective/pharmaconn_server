const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const Topics = require("../models/Topics");

router.get("/topics", auth, (req, res) => {
  Topics.find()
    .populate("user", "-password")
    .then((docs) => {
      if (docs.length === 0) {
        res.json({
          success: "no Topics found",
          topics: docs,
        });
      } else {
        res.json({
          success: "Topics found",
          topics: docs,
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
        message: "an error occurred",
      });
    });
});

router.post("/topics", auth, (req, res) => {
  console.log(res.locals.user);
  Topics.findOne(
    {
      title: req.body.title.toLowerCase(),
    },
    (err, doc) => {
      if (doc) {
        res.json({
          error: "a similar Topic already exists",
          topic: doc,
        });
      } else {
        const newTopic = new Topics({
          title: req.body.title.toLowerCase(),
          description: req.body.description,
          user: res.locals.user.id,
          followers: [res.locals.user.id],
        });
        newTopic
          .save()
          .then((docs) => {
            Topics.find()
              .populate("user", "-password")
              .then((docs) => {
                if (docs.length === 0) {
                  res.json({
                    success: "no Topics found",
                  });
                } else {
                  res.json({
                    success: "Topics created",
                    data: docs,
                  });
                }
              })
              .catch((err) => {
                res.status(400).json({
                  error: err,
                  message: "an error occurred",
                });
              });
          })
          .catch((err) => {
            res.status(400).json({
              error: err,
              message: "an error occurred",
            });
          });
      }
    }
  );
});
router.delete("/topics", auth, (req, res) => {
  console.log(res.locals.user);
  Topics.findOne(
    {
      _id: req.body.topicId,
    },
    (err, doc) => {
      if (err) {
        res.status(400).json({
          error: err,
          message: "an error occurred",
        });
        return;
      }
      if (doc === null) {
        res.status(404).json({
          error: "document does not exist",
          message: "an error occurred",
        });
        return;
      }
      console.log(doc);
      if (doc.user.toString() === res.locals.user.id) {
        doc
          .deleteOne()
          .then((result) =>
            res.json({
              success: "deleted",
              result,
            })
          )
          .catch((err) =>
            res.status(400).json({
              error: err,
              message: "an error occurred while deleting document",
            })
          );
      } else {
        res.status(401).json({
          error: "action unauthorised",
        });
      }
    }
  );
});
router.put("/topics", auth, (req, res) => {
  console.log(res.locals.user);
  Topics.findOne(
    {
      _id: req.body.topicId,
    },
    (err, doc) => {
      if (err) {
        res.status(400).json({
          error: err,
          message: "an error occurred",
        });
        return;
      }
      if (doc === null) {
        res.status(404).json({
          error: "document does not exist",
          message: "an error occurred",
        });
        return;
      }
      console.log(doc);
      if (doc.user.toString() === res.locals.user.id) {
        doc
          .updateOne({
            title: req.body.title,
            description: req.body.description,
          })
          .then((result) =>
            res.json({
              success: "edited succesfully",
            })
          )
          .catch((err) =>
            res.status(400).json({
              error: err,
              message: "an error occurred while editing document",
            })
          );
      } else {
        res.status(401).json({
          error: "action unauthorised",
        });
      }
    }
  );
});
router.put("/topics/follow", auth, (req, res) => {
  const userId = res.locals.user.id;
  const topicId = req.body.topicId;
  Topics.findOne(
    {
      _id: topicId,
    },
    (err, doc) => {
      if (doc !== null && !doc.followers.includes(userId)) {
        Topics.findOneAndUpdate(
          {
            _id: topicId,
          },
          {
            $push: { followers: userId },
          }
        )
          .then((doc) =>
            res.json({
              sucess: "followed",
              doc,
            })
          )
          .catch((err) => {
            res.status(400).json({
              error: err,
              message: "an error occurred",
            });
          });
        return;
      }
      if (doc !== null && doc.followers.includes(userId)) {
        Topics.findOneAndUpdate(
          {
            _id: topicId,
          },
          {
            $pull: { followers: userId },
          }
        )
          .then((doc) =>
            res.json({
              sucess: "unfollowed",
              doc,
            })
          )
          .catch((err) => {
            res.status(400).json({
              error: err,
              message: "an error occurred",
            });
          });
        return;
      }

      if (doc === null) {
        res.status(400).json({
          error: "topic not found",
          message: "an error occurred",
        });
      }
    }
  );
  return;
});
module.exports = router;
