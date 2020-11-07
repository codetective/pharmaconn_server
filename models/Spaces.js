const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const SpaceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
      unique: true,
    },
    slug: { type: String, slug: "title", unique: true },

    description: {
      type: String,
      required: true,
      maxlength: 200,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    questions: [
      {
        // this is the list of question that this user has asked
        type: Schema.Types.ObjectId,
        ref: "questionsModel",
      },
    ],
    posts: [
      {
        // this is the list of question that this user has asked
        type: Schema.Types.ObjectId,
        ref: "posts",
      },
    ],
    image: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Spaces = mongoose.model("spaces", SpaceSchema);
