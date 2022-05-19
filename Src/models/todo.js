const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    username: {
        type: String,
        required: true,
      },
  },
  { timestamps: true }
);

const Todo = mongoose.model('Todo', todoSchema);

module.exports = { Todo }