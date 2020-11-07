const mongoose = require("mongoose");

const notiSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    mssg: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const notification = mongoose.model("Noty", notiSchema);

module.exports = notification;
