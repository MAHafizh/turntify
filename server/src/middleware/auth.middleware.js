import { clerkClient, getAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import { errorResponse } from "../utils/response.js";

export const requireAdmin = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const currentUser = await clerkClient.users.getUser(userId);
    const isAdmin =
      process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

    if (!isAdmin) {
      res.status(403).json({ message: "Unauthorized" });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const authUser = async (req, res, next) => {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) return errorResponse(res, "Unauthorized", 403);
    const user = await User.findOne({ clerkId });
    if (!user) return errorResponse(res, "User Not Found", 404);
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
