import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { uploadToCloudinary } from "../utils/UploadToCloudinary.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { deleteFromCloudinary } from "../utils/DeleteFromCloudinary.js";

export const getAllSong = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    if (songs.length === 0) return errorResponse(res, "Songs is Empty", 200);
    return successResponse(res, "Songs Retrieve Successful", 200, songs);
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
    return successResponse(res, "Song Retrieve Successful", 200, song);
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
          albumId: 1,
        },
      },
    ]);
    return successResponse(
      res,
      "Featured Songs Retrieve Successful",
      200,
      songs,
    );
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
          albumId: 1,
        },
      },
    ]);
    return successResponse(
      res,
      "Trending Songs Retrieve Successful",
      200,
      songs,
    );
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
          albumId: 1,
        },
      },
    ]);
    return successResponse(
      res,
      "Made For You Songs Retrieve Successful",
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
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return errorResponse(res, "Please Upload Files", 500);
    }

    const {
      title,
      performer,
      writer,
      publisher,
      albumId,
      duration,
      releaseYear,
    } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      performer,
      writer,
      publisher,
      audioUrl,
      imageUrl,
      duration,
      releaseYear,
      albumId: albumId || null,
    });

    await song.save();

    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }
    return successResponse(res, "Song Upload Successful", 200, song);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Song Upload Failed", 500);
  }
};

export const updateSong = async (req, res) => {
  try {
    const {
      title,
      performer,
      writer,
      publisher,
      albumId,
      duration,
      releaseYear,
    } = req.body;
    const { id } = req.params;
    const song = await Song.findById(id);
    if (!song) return errorResponse(res, "Song Not Found", 404);

    if (title) song.title = title;
    if (performer) song.performer = performer;
    if (writer) song.writer = writer;
    if (publisher) song.publisher = publisher;
    if (duration) song.duration = duration;
    if (releaseYear) song.releaseYear = releaseYear;
    if (albumId !== undefined) {
      if (song.albumId) {
        await Album.findByIdAndUpdate(song.albumId, {
          $pull: { songs: song._id },
        });
      } else if (albumId) {
        await Album.findByIdAndUpdate(albumId, {
          $push: { songs: song._id },
        });
        song.albumId = albumId;
      } else {
        song.albumId = null;
      }
    }

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
    const { id } = req.params;
    const song = await Song.findById(id);
    if (!song) return errorResponse(res, "Song Not Found", 404);
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }
    await deleteFromCloudinary(song.audioUrl);
    await deleteFromCloudinary(song.imageUrl);
    await Song.findByIdAndDelete(id);
    return successResponse(res, "Song Delete Successful", 200);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Song Delete Failed", 500);
  }
};
