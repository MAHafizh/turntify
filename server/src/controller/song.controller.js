import { Song } from "../models/song.model.js";
import { uploadToCloudinary } from "../utils/UploadToCloudinary.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { deleteFromCloudinary } from "../utils/DeleteFromCloudinary.js";
import { Genre } from "../models/genre.model.js";

export const getAllSong = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    if (songs.length === 0) return errorResponse(res, "Songs is Empty", 200);
    return successResponse(res, "Songs Retrieve Success", 200, songs);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Songs Retrieve Failed", 500);
  }
};

export const getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);
    if (!song) return errorResponse(res, "Song Not Found", 404);
    return successResponse(res, "Song Retrieve Success", 200, song);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Song Retrieve Failed", 500);
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
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    return successResponse(res, "Featured Songs Retrieve Success", 200, songs);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Featured Songs Retrieve Failed", 500);
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
    return successResponse(res, "Trending Songs Retrieve Success", 200, songs);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Trending Songs Retrieve Failed", 500);
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
      "Made For You Songs Retrieve Success",
      200,
      songs,
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Made For You Songs Retrieve Failed", 500);
  }
};

export const createSong = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return errorResponse(res, "Please Upload Files", 500);
    }

    const { title, performer, writer, publisher, duration, releaseYear } =
      req.body;

    let { genre } = req.body;

    if (!Array.isArray(genre)) {
      genre = [genre];
    }

    if (genre.length === 0) return errorResponse(res, "Genre is empty", 400);

    const existingGenre = await Genre.find({
      title: { $in: genre },
    });

    if (existingGenre.length !== genre.length) {
      return errorResponse(res, "Genre not valid", 400);
    }

    const genreIds = existingGenre.map((item) => item._id);

    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;
    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      performer,
      writer,
      publisher,
      imageUrl,
      audioUrl,
      genre: genreIds,
      duration,
      releaseYear,
      createdBy: userId,
    });

    await song.save();
    return successResponse(res, "Song Upload Success", 200, song);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Song Upload Failed", 500);
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
    } = req.body;

    const song = await Song.findById(id);
    if (!song) return errorResponse(res, "Song Not Found", 404);

    if (!song.createdBy.equals(userId)) {
      return errorResponse(res, "Unauthorized", 401);
    }

    if (title !== undefined) song.title = title;
    if (performer !== undefined) song.performer = performer;
    if (writer !== undefined) song.writer = writer;
    if (publisher !== undefined) song.publisher = publisher;
    if (duration !== undefined) song.duration = duration;
    if (releaseYear !== undefined) song.releaseYear = releaseYear;
    if (genre !== undefined) song.genre = genre;

    if (req.files?.audioFile) {
      await deleteFromCloudinary(song.audioUrl);
      const audioUrl = await uploadToCloudinary(req.files.audioFile);
      song.audioUrl = audioUrl;
    }

    if (req.files?.imageFile) {
      await deleteFromCloudinary(song.imageUrl);
      const imageUrl = await uploadToCloudinary(req.files.imageFile);
      song.imageUrl = imageUrl;
    }

    await song.save();

    return successResponse(res, "Song Update Success", 200, song);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Song Update Failed", 500);
  }
};

export const deleteSong = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const song = await Song.findById(id);
    if (!song) return errorResponse(res, "Song Not Found", 404);

    if (!song.createdBy.equals(userId)) {
      return errorResponse(res, "Unauthorized", 401);
    }

    await deleteFromCloudinary(song.audioUrl);
    await deleteFromCloudinary(song.imageUrl);
    await Song.findByIdAndDelete(id);
    return successResponse(res, "Song Delete Success", 200);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Song Delete Failed", 500);
  }
};
