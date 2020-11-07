const io = require("./server");
const Topics = require("./models/Topics");
const Questions = require("./models/Questions");
const Answer = require("./models/Answer");
const jwt = require("jsonwebtoken");

console.log("connected via test file");
io.on("connection", (socket) => {
  console.log("connected");
  //check and decode jwt
  if (!socket.handshake.query.id) {
    console.log("no id");
    return;
  }
  let id = socket.handshake.query.id;

  User.findOneAndUpdate(
    { _id: id },
    { isOnline: true },
    { new: true, upsert: true, select: "-password" },
    (err, res) => {
      if (res) {
        socket.emit("userOnline", res);
      }
    }
  );

  //follow topics

  socket.on("topicFollow", ({ topicId, userId }) => {
    console.log(topicId, userId);
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
            },
            { new: true },
            (err, res) => {
              if (res) {
                socket.emit("topicFollowed", res);
                console.log("flo");
              }
            }
          );
        }
        if (doc !== null && doc.followers.includes(userId)) {
          Topics.findOneAndUpdate(
            {
              _id: topicId,
            },
            {
              $pull: { followers: userId },
            },
            { new: true },

            (err, res) => {
              if (res) {
                socket.emit("topicFollowed", res);
                console.log("unf");
              }
            }
          );
        }
      }
    );
  });
  //end of follow topic
  socket.on("questionFollow", ({ questionId, userId }) => {
    Questions.findOne(
      {
        _id: questionId,
      },
      (err, doc) => {
        if (doc !== null && !doc.followers.includes(userId)) {
          Questions.findOneAndUpdate(
            {
              _id: questionId,
            },
            {
              $push: { followers: userId },
            },
            { new: true, populate: "topics" },
            (err, res) => {
              if (res) {
                socket.emit("questionFollowed", res);
              }
            }
          );
        }
        if (doc !== null && doc.followers.includes(userId)) {
          Questions.findOneAndUpdate(
            {
              _id: questionId,
            },
            {
              $pull: { followers: userId },
            },
            { new: true, populate: "topics" },

            (err, res) => {
              if (res) {
                socket.emit("questionFollowed", res);
              }
            }
          );
        }
      }
    );
  });
  //end of follow question

  //upvote answer
  socket.on("answerUpvote", ({ answerId, userId }) => {
    console.log(answerId, userId);
    Answer.findOne(
      {
        _id: answerId,
      },
      (err, doc) => {
        if (
          doc !== null &&
          !doc.upvotes.includes(userId) &&
          !doc.downvotes.includes(userId)
        ) {
          Answer.findOneAndUpdate(
            {
              _id: answerId,
            },
            {
              $push: { upvotes: userId },
            },
            {
              new: true,
              populate: {
                path: "user question topics upvotes downvotes",
                select: "-password",
              },
            },
            (err, res) => {
              if (res) {
                io.sockets.emit("answerVoted", res);
              }
              if (err) {
                console.log(err);
              }
            }
          );
        }
        if (
          doc !== null &&
          doc.upvotes.includes(userId) &&
          !doc.downvotes.includes(userId)
        ) {
          Answer.findOneAndUpdate(
            {
              _id: answerId,
            },
            {
              $pull: { upvotes: userId },
            },
            {
              new: true,
              populate: {
                path: "user question topics upvotes downvotes",
                select: "-password",
              },
            },
            (err, res) => {
              if (res) {
                io.sockets.emit("answerVoted", res);
              }
              if (err) {
                console.log(err);
              }
            }
          );
        }
        if (
          doc !== null &&
          !doc.upvotes.includes(userId) &&
          doc.downvotes.includes(userId)
        ) {
          Answer.findOneAndUpdate(
            {
              _id: answerId,
            },
            {
              $pull: { downvotes: userId },
              $push: { upvotes: userId },
            },
            {
              new: true,
              populate: {
                path: "user question topics upvotes downvotes",
                select: "-password",
              },
            },
            (err, res) => {
              if (res) {
                io.sockets.emit("answerVoted", res);
              }
              if (err) {
                console.log(err);
              }
            }
          );
        }
      }
    );
  });
  //downvote ans
  socket.on("answerDownvote", ({ answerId, userId }) => {
    console.log(answerId, userId);
    Answer.findOne(
      {
        _id: answerId,
      },
      (err, doc) => {
        if (
          doc !== null &&
          !doc.upvotes.includes(userId) &&
          !doc.downvotes.includes(userId)
        ) {
          Answer.findOneAndUpdate(
            {
              _id: answerId,
            },
            {
              $push: { downvotes: userId },
            },
            {
              new: true,
              populate: {
                path: "user question topics upvotes downvotes",
                select: "-password",
              },
            },
            (err, res) => {
              if (res) {
                io.sockets.emit("answerVoted", res);
              }
              if (err) {
                console.log(err);
              }
            }
          );
        }
        if (
          doc !== null &&
          doc.upvotes.includes(userId) &&
          !doc.downvotes.includes(userId)
        ) {
          Answer.findOneAndUpdate(
            {
              _id: answerId,
            },
            {
              $pull: { upvotes: userId },
              $push: { downvotes: userId },
            },
            {
              new: true,
              populate: {
                path: "user question topics upvotes downvotes",
                select: "-password",
              },
            },
            (err, res) => {
              if (res) {
                io.sockets.emit("answerVoted", res);
              }
              if (err) {
                console.log(err);
              }
            }
          );
        }
        if (
          doc !== null &&
          !doc.upvotes.includes(userId) &&
          doc.downvotes.includes(userId)
        ) {
          Answer.findOneAndUpdate(
            {
              _id: answerId,
            },
            {
              $pull: { downvotes: userId },
            },
            {
              new: true,
              populate: {
                path: "user question topics upvotes downvotes",
                select: "-password",
              },
            },
            (err, res) => {
              if (res) {
                io.sockets.emit("answerVoted", res);
              }
              if (err) {
                console.log(err);
              }
            }
          );
        }
      }
    );
  });
  //disconnect
  socket.on("disconnect", () => {
    console.log("disconnected");
    User.findOneAndUpdate(
      { _id: id },
      { isOnline: false },
      { new: true, select: "-password" },
      (err, res) => {
        if (res) {
          socket.emit("userOffline", res);
        }
      }
    );
  });
});
