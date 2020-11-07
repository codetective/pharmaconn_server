const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UpvoteModel = new Schema(
  {
    questionid: {
      type: Schema.Types.ObjectId,
      ref: "questionsModel",
    },
    votes: [
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

module.exports = Upvote = mongoose.model("upvotes", UpvoteModel);
