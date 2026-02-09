import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const getStatistic = async (req, res) => {
  try {
    const [totalSongs, totalAlbums, totalUsers] = await Promise.all([
      Song.countDocuments(),
      Album.countDocuments(),
      User.countDocuments(),
    ]);
    return successResponse(res, "Statistic Retrieve Success", 200, {
      totalSongs,
      totalAlbums,
      totalUsers,
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Statistic Retrive Failed");
  }
};