const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Spaces = require("../models/Spaces");

router.get("/spaces", (req, res) => {
  Spaces.find()
    .populate("user", "-password")
    .populate("members", "name")
    .then((docs) => {
      if (docs.length === 0) {
        res.json({
          success: "no spaces found",
          spaces: [],
        });
      } else {
        res.json({
          success: "spaces found",
          spaces: docs,
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
router.get("/spaces/single", (req, res) => {
  const slug = req.body.slug.toString().toLowerCase();
  Spaces.findOne({
    slug: slug,
  })
    .populate("user", "-password")
    .populate("members", "name profileurl")
    .then((doc) => {
      if (doc === null) {
        res.status(404).json({
          error: "document not found",
          message: "an error occured",
        });
        return;
      } else {
        res.json({
          success: "space found",
          data: doc,
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        error: err.toString(),
        message: "an error occurred",
      });
    });
});
router.get("/spaces/forme", auth, (req, res) => {
  Spaces.find({
    members: { $in: [res.locals.user.id] },
  })
    .then((docs) => {
      if (docs.length === 0) {
        res.json({
          success: "no spaces found",
        });
      } else {
        res.json({
          success: "spaces found",
          data: docs,
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        error: err.toString(),
        message: "an error occurred",
      });
    });
});
router.post("/spaces", auth, (req, res) => {
  Spaces.findOne(
    {
      title: req.body.title.toLowerCase(),
    },
    (err, doc) => {
      if (doc) {
        res.json({
          error: "a similar space already exists",
          space: doc,
        });
      } else {
        const newSpace = new Spaces({
          title: req.body.title.toLowerCase(),
          description: req.body.description,
          user: res.locals.user.id,
          members: [res.locals.user.id],
        });
        newSpace
          .save()
          .then((docs) => {
            res.json({
              success: "space created",
              doc: docs,
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
router.delete("/spaces", auth, (req, res) => {
  console.log(res.locals.user);
  Spaces.findOne(
    {
      _id: req.body.spaceId,
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
router.put("/spaces", auth, (req, res) => {
  console.log(res.locals.user);
  Spaces.findOne(
    {
      _id: req.body.spaceId,
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
router.put("/spaces/join", auth, (req, res) => {
  const userId = res.locals.user.id;
  const spaceId = req.body.spaceId;
  Spaces.findOne(
    {
      _id: spaceId,
    },
    (err, doc) => {
      if (doc !== null && !doc.members.includes(userId)) {
        Spaces.findOneAndUpdate(
          {
            _id: spaceId,
          },
          {
            $push: { members: userId },
          }
        )
          .then((doc) =>
            res.json({
              sucess: "joined",
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
      if (doc !== null && doc.members.includes(userId)) {
        Spaces.findOneAndUpdate(
          {
            _id: spaceId,
          },
          {
            $pull: { members: userId },
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
          error: "space not found",
          message: "an error occurred",
        });
      }
    }
  );
  return;
});

module.exports = router;
