import dotenv from "dotenv";
import { uploadToCloudinary } from "../utils/UploadToCloudinary.js";
import { Album } from "../models/album.model.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { deleteFromCloudinary } from "../utils/DeleteFromCloudinary.js";
import { Song } from "../models/song.model.js";
dotenv.config();

export const getAlbum = async (req, res) => {
  try {
    const album = await Album.find();
    if (album.length === 0) return errorResponse(res, "Album is empty", 200);
    return successResponse(res, "Album retrieve success", 200, album);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Album retrieve failed", 500);
  }
};

export const getAlbumById = async (req, res) => {
  try {
    const { id } = req.params;
    const album = await Album.findById(id);
    if (!album) return errorResponse(res, "Album not found", 404);
    return successResponse(res, "Album retrieve success", 200, album);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Album retrieve failed", 500);
  }
};

export const createAlbum = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user._id;
    let imageUrl = process.env.DEFAULT_IMAGE;
    if (req.files?.imageFile)
      imageUrl = await uploadToCloudinary(req.files.imageFile);

    const album = new Album({
      title,
      createdBy: userId,
      imageUrl,
    });

    await album.save();
    return successResponse(res, "Album create success", 201, album);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Album create failed", 500);
  }
};

export const updateAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, visibility } = req.body || {};
    const userId = req.user._id;
    let newImageUrl = null;
    let oldImageUrl = null;

    const album = await Album.findOne({ _id: id, createdBy: userId });
    if (!album) return errorResponse(res, "Album not found", 404);

    if (title !== undefined) album.title = title;
    if (visibility !== undefined) album.visibility = visibility;

    if (req.files?.imageFile) {
      oldImageUrl = album.imageUrl;
      newImageUrl = await uploadToCloudinary(req.files.imageFile);
      album.imageUrl = newImageUrl;
    }
    const updatedAlbum = await album.save();
    if (updatedAlbum) {
      await deleteFromCloudinary(oldImageUrl);
      return successResponse(res, "Album update success", 200, updatedAlbum);
    } else await deleteFromCloudinary(newImageUrl);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Album update failed", 500);
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const album = await Album.findOne({ _id: id, createdBy: userId });
    if (!album) return errorResponse(res, "Album not found", 404);
    const deletedAlbum = await Album.findByIdAndDelete(id);
    if (deletedAlbum) {
      if (album.imageUrl !== process.env.DEFAULT_IMAGE)
        await deleteFromCloudinary(album.imageUrl);
      return successResponse(res, "Album delete success", 200);
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Album delete failed", 500);
  }
};

export const addSongToAlbum = async (req, res) => {
  try {
    const { albumId, songId } = req.params;
    const userId = req.user._id;
    const exist = await Song.exists({ _id: songId });
    if (!exist) return errorResponse(res, "Song not found", 404);

    const album = await Album.findOneAndUpdate(
      { _id: albumId, createdBy: userId },
      { $addToSet: { songs: songId } },
      { new: true },
    );

    if (!album)
      return errorResponse(res, "Album or song not found", 404);
    return successResponse(res, "Song added to album", 200, album);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Album update failed", 500);
  }
};

export const removeSongFromAlbum = async (req, res) => {
  try {
    const { albumId, songId } = req.params;
    const userId = req.user._id;
    const album = await Album.findOneAndUpdate(
      { _id: albumId, createdBy: userId, songs: songId },
      { $pull: { songs: songId } },
      { new: true },
    );

    if (!album)
      return errorResponse(res, "Album or song not found", 404);
    return successResponse(res, "Song remove success", 200, album);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Album update failed", 500);
  }
};
