import { getAuth } from "@clerk/express";
import { Playlist } from "../models/playlist.model.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/UploadToCloudinary.js";
import { deleteFromCloudinary } from "../utils/DeleteFromCloudinary.js";

const validateSongInPlaylist = (playlist, songId) => {
  if (!playlist) return false;
  return playlist.songs.some((s) => s.song && s.song.equals(songId));
};

export const getPlaylist = async (req, res) => {
  try {
    const userId = req.user._id;
    const playlists = await Playlist.find({ owner: userId });
    if (playlists.length === 0)
      return errorResponse(res, "Playlists is Empty", 200);
    return successResponse(
      res,
      "playlists Retrieve Successful",
      200,
      playlists,
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Playlist Retrieve Failed", 500);
  }
};

export const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findById(id).populate("songs");
    if (!playlist) return errorResponse(res, "Playlist Not Found", 404);
    return successResponse(res, "playlist Retrieve Successful", 200, playlist);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Playlist Retrieve Failed", 500);
  }
};

export const createPlaylist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title } = req.body;
    const imageUrl = process.env.DEFAULT_IMAGE;

    const playlist = new Playlist({
      title: title,
      owner: userId,
      imageUrl: imageUrl,
    });

    await playlist.save();
    return successResponse(res, "Playlist Create Success", 200, playlist);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Playlist Create Failed", 500);
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findById(id);
    if (!playlist) return errorResponse(res, "Playlist Not Found", 404);

    if (playlist.imageUrl !== process.env.DEFAULT_IMAGE) {
      await deleteFromCloudinary(playlist.imageUrl);
    }

    await Playlist.findByIdAndDelete(id);
    return successResponse(res, "Playlist Delete Successful", 200);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Playlist Delete Failed", 500);
  }
};

export const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, visibility } = req.body;

    const playlist = await Playlist.findById(id);
    if (!playlist) return errorResponse(res, "Playlist Not Found", 404);

    if (title) playlist.title = title;
    if (description) playlist.description = description;
    if (visibility) playlist.visibility = visibility;

    if (req.files?.imageFile) {
      const imageUrl = await uploadToCloudinary(req.files.imageFile);
      playlist.imageUrl = imageUrl;
    }

    await playlist.save();
    return successResponse(res, "Playlist Update Success", 200, playlist);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Playlist Update Failed", 500);
  }
};

export const addSongToPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { songId } = req.body;

    const playlist = await Playlist.findById(id);
    if (!playlist) return errorResponse(res, "Playlist Not Found", 404);
    const exist = validateSongInPlaylist(playlist, songId);
    if (!exist) {
      playlist.songs.push({
        song: songId,
        addedBy: userId,
      });
      await playlist.save();
      return successResponse(res, "Playlist Update Success", 200, playlist);
    } else return errorResponse(res, "Song Already in Playlist", 409);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Playlist Update Failed", 500);
  }
};

export const removeSongFromPlaylist = async (req, res) => {
  try {
    const { id, songId } = req.params;

    const playlist = await Playlist.findById(id);
    if (!playlist) return errorResponse(res, "Playlist Not Found", 404);
    const exist = validateSongInPlaylist(playlist, songId);
    if (exist) {
      const updatedPlaylist = await Playlist.findByIdAndUpdate(
        id,
        {
          $pull: { songs: { song: songId } },
        },
        { new: true },
      );
      return successResponse(
        res,
        "Playlist Update Success",
        200,
        updatedPlaylist,
      );
    } else return errorResponse(res, "Song Not Found in Playlist", 404);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Playlist Update Failed", 500);
  }
};
