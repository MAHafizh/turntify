import { getAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { Playlist } from "../models/playlist.model.js";

export const getAllUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.find().select("fullName");
    if (user.length === 0) return errorResponse(res, "Users is empty", 404);
    return successResponse(res, "User retrieve success", 200, user);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "User retrieve failed", 500);
  }
};

export const getFriend = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate(
      "friends",
      "fullName imageUrl",
    );
    if (!user) return errorResponse(res, "User not found", 404);
    const friends = user.friends;
    if (friends.length === 0)
      return errorResponse(res, "You don't have friend right now", 404);
    return successResponse(res, "Friend retrieve success", 200, friends);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Friend retrieve failed");
  }
};

export const addSavedAlbum = async (req, res) => {
  try {
    const userId = req.user._id;
    const { albumId } = req.params;
    const exist = await Album.exists({ _id: albumId });
    if (!exist) return errorResponse(res, "Album not found", 404);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { savedAlbums: albumId },
      },
      { new: true },
    );
    if (!updatedUser) return errorResponse(res, "User or album not found", 404);
    return successResponse(res, "User update success", 200, updatedUser);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "User update failed", 500);
  }
};

export const removeSavedAlbum = async (req, res) => {
  try {
    const userId = req.user._id;
    const { albumId } = req.params;
    const exist = await Album.exists({ _id: albumId });
    if (!exist) return errorResponse(res, "Album not found", 404);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { savedAlbums: albumId },
      },
      { new: true },
    );
    if (!updatedUser) return errorResponse(res, "User or album not found", 404);
    return successResponse(res, "User update success", 200, updatedUser);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "User update failed", 500);
  }
};

export const addPlaylist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { playlistId } = req.params;
    const exist = await Playlist.exists({ _id: playlistId });
    if (!exist) return errorResponse(res, "Playlist not found", 404);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { playlists: playlistId },
      },
      { new: true },
    );
    if (!updatedUser)
      return errorResponse(res, "User or playlist not found", 404);
    return successResponse(res, "User update success", 200, updatedUser);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "User update failed", 500);
  }
};

export const removePlaylist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { playlistId } = req.params;
    const exist = await Playlist.exists({ _id: playlistId });
    if (!exist) return errorResponse(res, "Playlist not found", 404);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { playlists: playlistId },
      },
      { new: true },
    );
    if (!updatedUser)
      return errorResponse(res, "User or playlist not found", 404);
    return successResponse(res, "User update success", 200, updatedUser);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "User update failed", 500);
  }
};

export const addLikedSong = async (req, res) => {
  try {
    const userId = req.user._id;
    const { songId } = req.params;
    const exist = await Song.exists({ _id: songId });
    if (!exist) return errorResponse(res, "Song not found", 404);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { likedSongs: songId },
      },
      { new: true },
    );
    if (!updatedUser) return errorResponse(res, "User or song not found", 404);
    return successResponse(res, "User update success", 200, updatedUser);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "User update failed", 500);
  }
};

export const removeLikedSong = async (req, res) => {
  try {
    const userId = req.user._id;
    const { songId } = req.params;
    const exist = await Song.exists({ _id: songId });
    if (!exist) return errorResponse(res, "Song not found", 404);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { likedSongs: songId },
      },
      { new: true },
    );
    if (!updatedUser) return errorResponse(res, "User or song not found", 404);
    return successResponse(res, "User update success", 200, updatedUser);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "User update failed", 500);
  }
};

export const addFriend = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;
    if (userId.toString() === friendId)
      return errorResponse(res, "You can't added yourself", 400);
    const exist = await User.exists({ _id: friendId });
    if (!exist) return errorResponse(res, "User not found", 404);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { friends: friendId },
      },
      { new: true },
    );
    if (!updatedUser) return errorResponse(res, "User not found", 404);
    return successResponse(res, "User update success", 200, updatedUser);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "User update failed", 500);
  }
};

export const removeFriend = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;
    const exist = await User.exists({ _id: friendId });
    if (!exist) return errorResponse(res, "User not found", 404);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { friends: friendId },
      },
      { new: true },
    );
    if (!updatedUser) return errorResponse(res, "User not found", 404);
    return successResponse(res, "User update success", 200, updatedUser);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "User update failed", 500);
  }
};
