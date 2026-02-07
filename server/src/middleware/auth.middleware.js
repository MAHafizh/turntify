import { clerkClient, getAuth } from "@clerk/express";

export const requireAdmin = async (req, res, next) => {
  try {
    const {userId} = getAuth(req)
    const currentUser = await clerkClient.users.getUser(userId)
    const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress

    if(!isAdmin) {
      res.status(403).json({message: "Unauthorized"})
    }
    next()
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: "Internal server error"})
  }
}