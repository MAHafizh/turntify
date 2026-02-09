import { getAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const getAllUser = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const user = await User.find({ clerkId: { $ne: userId } });
    if (user.length === 0) return errorResponse(res, "Users is Empty", 404);
    return successResponse(res, "User Retrieve Success", 200, user);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "User Retrieve Failed");
  }
};
