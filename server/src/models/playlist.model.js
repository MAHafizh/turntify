import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    songs: [
      {
        song: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Song",
        },
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    description: {
      type: String,
      maxlength: 300,
      required: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
