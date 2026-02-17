import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist" }],
    savedAlbums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }],
    likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
