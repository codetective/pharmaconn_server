const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnswerModel = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    answer: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "questionsModel",
    },
    topics: [
      {
        type: Schema.Types.ObjectId,
        ref: "topics",
      },
    ],
    space: {
      type: Schema.Types.ObjectId,
      ref: "spaces",
    },

    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "comments",
      },
    ],
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

module.exports = Answer = mongoose.model("answers", AnswerModel);
