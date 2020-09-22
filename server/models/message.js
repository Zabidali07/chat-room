const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  // chat: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true,
  //   ref: "Chat",
  // },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "User",
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "User",
  },
  message: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Message", messageSchema);
