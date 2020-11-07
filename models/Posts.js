const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    post: {
      type: String,
      required: true,
    },
    comments: [
      {
        // this is the list of comments that this post has
        type: Schema.Types.ObjectId,
        ref: "comments",
      },
    ],
    upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "upvotes",
      },
    ],

    downvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "downvotes",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = Posts = mongoose.model("posts", PostSchema);
