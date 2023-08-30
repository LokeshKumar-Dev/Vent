const mongoose = require("mongoose");

// Creating the schema for the transaction model fields of user id, name, description, amount, category, type, cycle, status, auto, and date
const Schema = mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["send", "cross", "swap"],
      default: "send",
      require: true,
    },
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    fromChain: {
      type: String,
      required: true,
    },
    toChain: {
      type: String,
      required: true,
    },
    token: {
      type: Boolean,
    },
    hash: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("transactions", Schema);

module.exports = Transaction;
