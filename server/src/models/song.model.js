import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    performer: {
      type: String,
      required: true,
    },
    writer: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    genre: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
        required: true,
      },
    ],
    duration: {
      type: Number,
      required: true,
    },
    releaseYear: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    played: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Song = mongoose.model("Song", songSchema);
