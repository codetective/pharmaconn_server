const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const Schema = mongoose.Schema;

const TopicSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },

    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    slug: { type: String, slug: "title", unique: true },

    description: {
      type: String,
      required: true,
      maxlength: 200,
    },
    image: {
      type: Buffer,
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

module.exports = Topics = mongoose.model("topics", TopicSchema);
