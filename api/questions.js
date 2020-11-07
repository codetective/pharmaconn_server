const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const Questions = require("../models/Questions");
const Topics = require("../models/Topics");

router.get("/questions/foryou", auth, async (req, res) => {
  Topics.find(
    {
      followers: {
        $in: [res.locals.user.id],
      },
    },
    (err, docs) => {
      if (err) {
        res.json({
          message: err.toString(),
          error: "an error occurred",
        });
      }
      if (docs) {
        let arr = [];
        docs.forEach((doc) => arr.push(doc._id));
        Questions.find({
          $and: [{ answers: { $size: 0 } }, { topics: { $in: arr } }],
        })
          .populate("topics")
          .then((ds) => {
            res.json({
              questions: ds,
            });
          })
          .catch((err) => {
            res.status(401).json({
              error: "an error occurred",
              message: err,
            });
          });
      }
    }
  );
});

router.get("/questions/byuser", auth, (req, res) => {
  Questions.find({
    user: req.body.userId,
  })
    .populate("user followers views topics upvotes downvotes", "-password")
    .then((docs) => {
      if (docs === null) {
        res.json({
          success: "User has no questions",
          docs,
        });
      }

      if (docs !== null) {
        res.json({
          success: "questions retrieved",
          questions: docs,
        });
      }
    })
    .catch((err) => {
      console.log(err.toString());
      res.status(400).json({
        error: "an error occurred",
        err: err,
      });
    });
});
router.get("/questions/byme", auth, (req, res) => {
  const user = res.locals.user;
  Questions.find({
    user: user.id,
  })
    .populate("user followers views topics upvotes downvotes", "-password")
    .then((docs) => {
      if (docs === null) {
        res.json({
          success: "You have no questions",
          docs,
        });
      }

      if (docs !== null) {
        res.json({
          success: "questions retrieved",
          questions: docs,
        });
      }
    })
    .catch((err) => {
      console.log(err.toString());

      res.status(400).json({
        error: "an error occurred",
        err: err,
      });
    });
});

router.post("/questions", auth, (req, res) => {
  console.log(req.body);
  const newQuestion = new Question({
    question: req.body.question,
    user: res.locals.user.id,
    topics: [...req.body.topics],
    followers: [res.locals.user.id],
  });
  newQuestion
    .save()
    .then((docs) => {
      console.log(docs);
      res.json({
        success: "space created",
        question: docs,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
        message: "an error occurred",
      });
    });
});

router.put("/questions/follow", auth, (req, res) => {
  const userId = res.locals.user.id;
  const qid = req.body.qid;
  Questions.findOne(
    {
      _id: qid,
    },
    (err, doc) => {
      if (doc !== null && !doc.followers.includes(userId)) {
        Questions.findOneAndUpdate(
          {
            _id: qid,
          },
          {
            $push: {
              followers: userId,
            },
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
        Questions.findOneAndUpdate(
          {
            _id: spaceId,
          },
          {
            $pull: { members: userId },
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
      }
      if (doc === null) {
        res.status(400).json({
          error: "question not found",
          message: "an error occurred",
        });
      }
    }
  );
});

router.delete("/questions", auth, (req, res) => {
  console.log(res.locals.user);
  Questions.findOne(
    {
      _id: req.body.qid,
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

router.put("/questions", auth, (req, res) => {
  Questions.findOne(
    {
      _id: req.body.qid,
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
            question: req.body.title,
            topics: [...req.body.topics],
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

module.exports = router;
