import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import { deleteFromCloudinary } from "../utils/DeleteFromCloudinary.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { uploadToCloudinary } from "../utils/UploadToCloudinary.js";

const validateSongInAlbum = (album, songId) => {
  if (!album) return false;
  return album.songs.some((s) => s.song && s.song.equals(songId));
};

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
    const album = await Album.findById(id).populate("songs.song");
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
    let imageUrl = process.env.DEFAULT_IMAGE;
    if (req.files?.imageFile) {
      imageUrl = await uploadToCloudinary(req.files.imageFile);
    }

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

export const updateAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, artist, releaseYear } = req.body;
    const album = await Album.findById(id);
    if (!album) return errorResponse(res, "Album Not Found", 404);

    if (title) album.title = title;
    if (artist) album.artist = artist;
    if (releaseYear) album.releaseYear = releaseYear;

    if (req.files?.imageFile) {
      await deleteFromCloudinary(album.imageUrl);
      const imageUrl = await uploadToCloudinary(req.files.imageFile);
      album.imageUrl = imageUrl;
    }

    await album.save();
    return successResponse(res, "Album Update Successful", 200, album);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Album Update Failed", 500);
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

export const addSongToAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const { songId } = req.body;
    const album = await Album.findById(id);
    if (!album) return errorResponse(res, "Album Not Found", 404);
    const exist = validateSongInAlbum(album, songId);
    if (!exist) {
      album.songs.push({
        song: songId,
      });
      await Song.findByIdAndUpdate(songId, { albumId: id });
      await album.save();
      return successResponse(res, "Album Update Successful", 200, album);
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Album Update Failed");
  }
};

export const removeSongFromAlbum = async (req, res) => {
  try {
    const { id, songId } = req.params;
    const album = await Album.findById(id);
    if (!album) return errorResponse(res, "Album Not Found", 404);
    const exist = validateSongInAlbum(album, songId);
    if (exist) {
      const updatedAlbum = await Album.findByIdAndUpdate(
        id,
        {
          $pull: { songs: { song: songId } },
        },
        { new: true },
      );
      return successResponse(res, "Album Update Success", 200, updatedAlbum);
    } else return errorResponse(res, "Song Not Found in Album", 404);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Album Update Failed");
  }
};
