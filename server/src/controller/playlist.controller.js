import dotenv from "dotenv";
import { errorResponse, successResponse } from "../utils/response.js";
import { Playlist } from "../models/playlist.model.js";
import { uploadToCloudinary } from "../utils/UploadToCloudinary.js";
import { deleteFromCloudinary } from "../utils/DeleteFromCloudinary.js";
import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";

export const getPlaylist = async (req, res) => {
  try {
    const userId = req.user._id;
    const playlist = await Playlist.find({
      $or: [{ createdBy: userId }, { collaborators: userId }],
    });
    if (playlist.length === 0)
      return errorResponse(res, "Playlist is empty", 200);
    return successResponse(res, "Playlist retrieve success", 200, playlist);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Playlist retrieve failed", 500);
  }
};

export const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findById(id);
    if (!playlist) return errorResponse(res, "playlist is empty", 200);
    return successResponse(res, "Playlist retrieve success", 200, playlist);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Playlist retrieve failed", 500);
  }
};

export const createPlaylist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, description } = req.body;
    let imageUrl = process.env.DEFAULT_IMAGE;

    if (req.files?.imageFile)
      imageUrl = await uploadToCloudinary(req.files.imageFile);

    const playlist = new Playlist({
      title,
      imageUrl,
      createdBy: userId,
    });
    if (description !== undefined) playlist.description = description;
    const createdPlaylist = await playlist.save();
    return successResponse(
      res,
      "Playlist create success",
      200,
      createdPlaylist,
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Playlist create failed", 500);
  }
};

export const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, visibility, description } = req.body || {};
    const userId = req.user._id;
    let newImageUrl = null;
    let oldImageUrl = null;

    const playlist = await Playlist.findOne({ _id: id, createdBy: userId });
    if (!playlist) return errorResponse(res, "Playlist not found", 404);

    if (title !== undefined) playlist.title = title;
    if (visibility !== undefined) playlist.visibility = visibility;
    if (description !== undefined) playlist.description = description;

    if (req.files?.imageFile) {
      oldImageUrl = playlist.imageUrl;
      newImageUrl = await uploadToCloudinary(req.files.imageFile);
      playlist.imageUrl = newImageUrl;
    }
    const updatedPlaylist = await playlist.save();
    if (updatedPlaylist) {
      if (oldImageUrl !== process.env.DEFAULT_IMAGE)
        await deleteFromCloudinary(oldImageUrl);
      return successResponse(
        res,
        "Playlist update success",
        200,
        updatedPlaylist,
      );
    } else await deleteFromCloudinary(newImageUrl);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Playlist update failed", 500);
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const playlist = await Playlist.findOne({ _id: id, createdBy: userId });
    if (!playlist) return errorResponse(res, "Playlist not found", 404);
    const deletedPlaylist = await Playlist.findByIdAndDelete(id);
    if (deletedPlaylist) {
      if (playlist.imageUrl !== process.env.DEFAULT_IMAGE)
        await deleteFromCloudinary(playlist.imageUrl);
      return successResponse(res, "Playlist delete success", 200);
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Playlist delete failed", 500);
  }
};

export const addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.params;
    const userId = req.user._id;

    const exist = await Song.exists({ _id: songId });
    if (!exist) return errorResponse(res, "Song not found", 404);

    const playlist = await Playlist.findOneAndUpdate(
      {
        _id: playlistId,
        $or: [{ createdBy: userId }, { collaborators: userId }],
        "songs.song": { $ne: songId },
      },
      {
        $push: {
          songs: {
            song: songId,
            addedBy: userId,
          },
        },
      },
      {
        new: true,
      },
    );

    if (!playlist) return errorResponse(res, "Playlist or song not found", 404);
    return successResponse(res, "Song added to playlist", 200, playlist);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Playlist update failed", 500);
  }
};

export const removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.params;
    const userId = req.user._id;

    const playlist = await Playlist.findOneAndUpdate(
      {
        _id: playlistId,
        $or: [{ createdBy: userId }, { collaborators: userId }],
        "songs.song": songId,
      },
      {
        $pull: { songs: { song: songId } },
      },
      { new: true },
    );

    if (!playlist) return errorResponse(res, "Playlist or song not found", 404);
    return successResponse(res, "Song remove to playlist", 200, playlist);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Playlist update failed", 500);
  }
};

export const addCollaboratorToPlaylist = async (req, res) => {
  try {
    const { playlistId, collaboratorId } = req.params;
    const userId = req.user._id;

    const exist = await User.exists({ _id: collaboratorId });
    if (!exist) return errorResponse(res, "User not found", 404);

    const playlist = await Playlist.findOneAndUpdate(
      {
        _id: playlistId,
        createdBy: userId,
        createdBy: { $ne: collaboratorId },
      },
      { $addToSet: { collaborators: collaboratorId } },
      { new: true },
    );

    if (!playlist) return errorResponse(res, "Playlist not found", 404);
    return successResponse(res, "Collaborator added", 200, playlist);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Playlist update failed", 500);
  }
};

export const removeCollaboratorFromPlaylist = async (req, res) => {
  try {
    const { playlistId, collaboratorId } = req.params;
    const userId = req.user._id;

    const playlist = await Playlist.findOneAndUpdate(
      { _id: playlistId, createdBy: userId, collaborators: collaboratorId },
      { $pull: { collaborators: collaboratorId } },
      { new: true },
    );

    if (!playlist) return errorResponse(res, "Playlist not found", 404);
    return successResponse(res, "Collaborator remove success", 200, playlist);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Playlist update failed", 500);
  }
};
