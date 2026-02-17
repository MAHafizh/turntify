import { Song } from "../models/song.model.js";
import { uploadToCloudinary } from "../utils/UploadToCloudinary.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { deleteFromCloudinary } from "../utils/DeleteFromCloudinary.js";
import { Genre } from "../models/genre.model.js";

export const getAllSong = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    if (songs.length === 0) return errorResponse(res, "Songs is empty", 404);
    return successResponse(res, "Songs retrieve success", 200, songs);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Songs retrieve failed", 500);
  }
};

export const getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);
    if (!song) return errorResponse(res, "Song not found", 404);
    return successResponse(res, "Song retrieve success", 200, song);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Song retrieve failed", 500);
  }
};

export const getFeaturedSongs = async (req, res) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          imageUrl: 1,
        },
      },
    ]);
    return successResponse(res, "Featured songs retrieve success", 200, songs);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Featured songs retrieve failed", 500);
  }
};

export const getTrendingSongs = async (req, res) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    return successResponse(res, "Trending songs retrieve success", 200, songs);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Trending songs retrieve failed", 500);
  }
};

export const getMadeForYouSongs = async (req, res) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    return successResponse(
      res,
      "Made For You songs retrieve success",
      200,
      songs,
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Made For You songs retrieve failed", 500);
  }
};

export const createSong = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return errorResponse(res, "Please upload files", 400);
    }

    const {
      title,
      performer,
      writer,
      publisher,
      duration,
      releaseYear,
      genre,
    } = req.body;

    if (!Array.isArray(genre) || genre.length === 0)
      return errorResponse(res, "Genre must be at least 1", 400);

    const existingGenre = await Genre.find({
      _id: { $in: genre },
    });

    console.log(existingGenre);

    if (existingGenre.length !== genre.length) {
      return errorResponse(res, "Genre not valid", 400);
    }

    const audioUrl = await uploadToCloudinary(req.files.audioFile);
    const imageUrl = await uploadToCloudinary(req.files.imageFile);

    const song = new Song({
      title,
      performer,
      writer,
      publisher,
      imageUrl,
      audioUrl,
      genre,
      duration,
      releaseYear,
      createdBy: userId,
    });

    const uploadedSong = await song.save();
    return successResponse(res, "Song upload success", 200, uploadedSong);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Song upload failed", 500);
  }
};

export const updateSong = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const {
      title,
      performer,
      writer,
      publisher,
      duration,
      releaseYear,
      genre,
    } = req.body || {};

    let newImageUrl = null;
    let oldImageUrl = null;
    let newAudioUrl = null;
    let oldAudioUrl = null;

    const song = await Song.findOne({ _id: id, createdBy: userId });
    if (!song) return errorResponse(res, "Song not found", 404);

    if (title !== undefined) song.title = title;
    if (performer !== undefined) song.performer = performer;
    if (writer !== undefined) song.writer = writer;
    if (publisher !== undefined) song.publisher = publisher;
    if (duration !== undefined) song.duration = duration;
    if (releaseYear !== undefined) song.releaseYear = releaseYear;
    if (genre !== undefined) song.genre = genre;

    if (req.files?.audioFile) {
      oldAudioUrl = song.audioUrl;
      newAudioUrl = await uploadToCloudinary(req.files.audioFile);
      song.audioUrl = newAudioUrl;
    }

    if (req.files?.imageFile) {
      oldImageUrl = song.imageUrl;
      newImageUrl = await uploadToCloudinary(req.files.imageFile);
      song.imageUrl = newImageUrl;
    }

    const updatedSong = await song.save();
    if (updatedSong) {
      await deleteFromCloudinary(oldAudioUrl);
      await deleteFromCloudinary(oldImageUrl);
      return successResponse(res, "Song update success", 200, updatedSong);
    } else {
      await deleteFromCloudinary(newAudioUrl);
      await deleteFromCloudinary(newImageUrl);
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Song update failed", 500);
  }
};

export const deleteSong = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const song = await Song.findOne({ _id: id, createdBy: userId });
    if (!song) return errorResponse(res, "Song not found", 404);

    const deletedSong = await Song.findByIdAndDelete(id);

    if (deletedSong) {
      await deleteFromCloudinary(song.imageUrl);
      await deleteFromCloudinary(song.audioUrl);
      return successResponse(res, "Song delete success", 200);
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Song delete failed", 500);
  }
};
