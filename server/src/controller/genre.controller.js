import { Genre } from "../models/genre.model.js";
import { successResponse } from "../utils/response.js";

export const getGenre = async (req, res, next) => {
  try {
    const genre = await Genre.find();
    return successResponse(res, 200, genre);
  } catch (error) {
    next(error);
  }
};
