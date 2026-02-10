import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

export const Genre = mongoose.model("Genre", genreSchema);