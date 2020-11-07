const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
//Initialize
mongoose.plugin(slug);

const QuestionsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    question: {
      type: String,
      required: true,
    },
    slug: { type: String, slug: "question", unique: true },

    views: [
      {
        user: { type: Schema.Types.ObjectId, ref: "users" },
      },
    ],

    upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
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
    answers: [
      {
        type: Schema.Types.ObjectId,
        ref: "answers",
      },
    ],
    downvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = Question = mongoose.model("questionsModel", QuestionsSchema);
