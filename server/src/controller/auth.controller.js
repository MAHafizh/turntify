import { User } from "../models/user.model.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const authCallback = async (req, res) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;
    const user = await User.findOne({ clerkId: id });

    if (!user) {
      await User.create({
        clerkId: id,
        fullName: `${firstName} ${lastName}`,
        imageUrl,
      });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
    console.error(error);
  }
};

export const getMe = async (req, res) => {
  try {
    const { _id, fullName, imageUrl } = req.user;
    return successResponse(res, "User Retieve Success", 200, {
      _id,
      fullName,
      imageUrl,
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, "User Retrieve Failed", 500);
  }
};
