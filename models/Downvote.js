const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DownvoteModel = new Schema(
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

module.exports = Downvote = mongoose.model("downvotes", DownvoteModel);
