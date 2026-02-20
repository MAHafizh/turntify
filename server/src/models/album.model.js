import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "private",
    required: true,
  },
  type: {
    type: String,
    enum: ["album", "ep", "single"],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

export const Album = mongoose.model("Album", albumSchema);