import { getAuth } from "@clerk/express";
import { Playlist } from "../models/playlist.model.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { User } from "../models/user.model.js";

export const createPlaylist = async (req, res) => {
  try {
    const { title } = req.body;
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) return errorResponse(res, "Unauthorized", 404);

    const user = await User.findOne({ clerkId });

    const imageUrl = process.env.DEFAULT_IMAGE;

    const playlist = new Playlist({
      title: title,
      owner: user._id,
      imageUrl: imageUrl,
    });

    await playlist.save();
    return successResponse(res, "Playlist Create Success", 200, playlist);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Playlist Create Failed", 500);
  }
};
