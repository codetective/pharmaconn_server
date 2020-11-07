const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      required: true,

      type: String,
    },
    gender: {
      required: true,
      enum: ["male", "female"],
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profileurl: {
      type: String,
      default:
        "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?cs=srgb&dl=pexels-mohamed-abdelgaffar-771742.jpg&fm=jpg",
    },
    dpId: {
      type: String,
      default: false,
    },
    livesIn: {
      type: String,
      default: "Add an address",
    },
    bio: {
      type: String,
      maxLength: 60,
      default: "Add a short description",
      trim: true,
    },
    birth: {
      type: Date,
    },

    from: {
      type: String,
      default: "Add where you're from",
    },
    work: {
      type: String,
      default: "Add work",
    },
    education: {
      type: Object,
      default: {
        default: "Add education",
      },
    },
    follows: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "questionsModel",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    // it will store all the followers
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    isOnline: false,
  },
  {
    timestamps: true,
  }
);

module.exports = User = mongoose.model("users", UserSchema);
