import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import { deleteFromCloudinary } from "../utils/DeleteFromCloudinary.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { uploadToCloudinary } from "../utils/UploadToCloudinary.js";

export const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find();
    if (albums.length === 0) {
      return errorResponse(res, "Albums is Empty", 200);
    }
    return successResponse(res, "Albums Retrieve Successful", 200, albums);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Albums Retrieve Failed", 500);
  }
};

export const getAlbumById = async (req, res) => {
  try {
    const { id } = req.params;
    const album = await Album.findById(id).populate("songs");
    if (!album) {
      return errorResponse(res, "Albums Not Found", 404);
    }
    return successResponse(res, "Albums Retrieve Successful", 200, album);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Albums Retrieve Failed", 500);
  }
};

export const createAlbum = async (req, res) => {
  try {
    const { title, artist, releaseYear } = req.body;
    const imageFile = req.files.imageFile;
    const imageUrl = await uploadToCloudinary(imageFile);

    const album = new Album({
      title,
      artist,
      imageUrl,
      releaseYear,
    });

    await album.save();

    return successResponse(res, "Album Upload Successful", 200, album);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Album Upload Failed", 500);
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const album = await Album.findById(id);
    if (!album) return errorResponse(res, "Album Not Found", 404);

    const songs = await Song.find({ albumId: id });

    for (const song of songs) {
      if (song.imageUrl) await deleteFromCloudinary(song.imageUrl);
      if (song.audioUrl) await deleteFromCloudinary(song.audioUrl);
    }

    await deleteFromCloudinary(album.imageUrl);

    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);

    return successResponse(res, "Album Delete Successful", 200);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Album Delete Failed", 500);
  }
};
