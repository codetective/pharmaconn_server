const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Questions = require("../models/Questions");
const Answer = require("../models/Answer");

// router.post("/answer/submit", auth, (req, res) => {
//   const answer = req.body.answer.toString();
//   const user = res.locals.user.id;
//   const qid = req.body.qid;
//   const newAnswer = new Answer({
//     user: user,
//     answer: answer,
//     question: qid,
//   });

//   newAnswer
//     .save()
//     .then((doc) => {
//       Questions.findOneAndUpdate(
//         {
//           _id: qid,
//         },
//         {
//           $push: { answers: doc._id },
//         }
//       )
//         .then((d) => {
//           res.status(201).json({
//             success: "answer added",
//             doc,
//             d,
//           });
//         })
//         .catch((err) => {
//           res.json({
//             error: "An error occured",
//             message: err,
//           });
//         });
//     })
//     .catch((err) => {
//       res.json({
//         error: "An error occured",
//         message: err,
//       });
//     });
// });

router.post("/answer/submit", auth, (req, res) => {
  const answer = req.body.answer.toString();
  const user = res.locals.user.id;
  const qid = req.body.qid;

  Question.findOne({ _id: qid })
    .then((doc) => {
      console.log(doc);
      const newAnswer = new Answer({
        user: user,
        answer: answer,
        question: qid,
        topics: doc.topics,
      });
      newAnswer
        .save()
        .then((dc) => {
          console.log(dc);
          Questions.findOneAndUpdate(
            {
              _id: qid,
            },
            {
              $push: { answers: dc._id },
            }
          )
            .then((d) => {
              res.status(201).json({
                success: "answer added",
                dc,
                d,
              });
            })
            .catch((err) => {
              res.status(400).json({
                error: "An error occured",
                message: err.toString(),
              });
            });
        })
        .catch((err) => {
          res.status(400).json({
            error: "An error occured",
            message: err.toString(),
          });
        });
    })
    .catch((err) => {
      res.status(404).json({
        error: "An error occured",
        message: err.toString(),
      });
    });
});

module.exports = router;
