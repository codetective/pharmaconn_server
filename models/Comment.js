const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentModel = new Schema(
  {
    answerid: {
      type: Schema.Types.ObjectId,
      ref: "answersmodel",
    },
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    answer: {
      type: Schema.Types.ObjectId,
      ref: "answer",
    },
    upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    downvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = Comment = mongoose.model("comments", CommentModel);
