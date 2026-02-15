import { Collection } from "../models/collection.model.js";
import { Song } from "../models/song.model.js";
import { deleteFromCloudinary } from "../utils/DeleteFromCloudinary.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { uploadToCloudinary } from "../utils/UploadToCloudinary.js";

const validateSongInCollection = (collection, songId) => {
  if (!collection) return false;
  return collection.songs.some((item) => item.song.toString() === songId);
};

export const getAlbumsFromCollection = async (req, res) => {
  try {
    const albums = await Collection.find({ type: "album" }).populate(
      "songs.song",
    );
    if (albums.length === 0) return errorResponse(res, "Albums is empty", 200);
    return successResponse(res, "Albums retrieve success", 200, albums);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Albums retrieve failed", 500);
  }
};

export const getAlbumsFromCollectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const album = await Collection.findOne({ _id: id, type: "album" }).populate(
      "songs.song",
    );
    if (!album) return errorResponse(res, "Album not found", 404);
    return successResponse(res, "Album retrieve success", 200, album);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Album retrieve failed", 500);
  }
};

export const getPlaylists = async (req, res) => {
  try {
    const userId = req.user._id;
    const playlists = await Collection.find({
      type: "playlist",
      $or: [{ createdBy: userId }, { collaborators: userId }],
    }).populate("songs.song");
    if (playlists.length === 0) {
      return errorResponse(res, "Playlists is empty", 200);
    }
    return successResponse(res, "Playlists retrieve success", 200, playlists);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Playlists retrieve failed", 500);
  }
};

export const createCollection = async (req, res) => {
  try {
    const { title, type, visibility, description } = req.body;
    const createdBy = req.user._id;
    let imageUrl = process.env.DEFAULT_IMAGE;
    if (req.files?.imageFile) {
      imageUrl = await uploadToCloudinary(req.files.imageFile);
    }

    const collection = new Collection({
      title,
      type,
      visibility,
      createdBy,
      imageUrl,
    });

    if (description !== undefined) collection.description = description;

    await collection.save();

    return successResponse(res, "Collection create success", 200, collection);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Collection create failed", 500);
  }
};

export const updatedCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { title, type, visibility, description } = req.body;
    const userId = req.user._id;

    const collection = await Collection.findById(collectionId);
    if (!collection) return errorResponse(res, "Collection not Found", 404);

    if (title !== undefined) collection.title = title;
    if (type !== undefined) collection.type = type;
    if (visibility !== undefined) collection.visibility = visibility;
    if (description !== undefined) collection.description = description;

    if (req.files?.imageFile) {
      await deleteFromCloudinary(collection.imageUrl);
      const imageUrl = await uploadToCloudinary(req.files.imageFile);
      collection.imageUrl = imageUrl;
    }

    if (!collection.createdBy.equals(userId)) {
      collection.collaborators.push(userId);
    }

    await collection.save();
    return successResponse(res, "Collection update success", 200, collection);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Collection update failed", 500);
  }
};

export const deleteCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const collection = await Collection.findById(collectionId);
    if (!collection) return errorResponse(res, "Collection not found", 404);
    await deleteFromCloudinary(collection.imageUrl);
    await Collection.findByIdAndDelete(collectionId);
    return successResponse(res, "Collection delete success", 200);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Collection delete failed", 500);
  }
};

export const addSongToCollection = async (req, res) => {
  try {
    const { songId, collectionId } = req.params;
    const userId = req.user._id;

    const collection = await Collection.findById(collectionId);
    const song = await Song.findById(songId);
    if (!song) return errorResponse(res, "Song not Found", 404);
    if (!collection) return errorResponse(res, "Collection not Found", 404);

    const exist = validateSongInCollection(collection, songId);
    if (exist) return errorResponse(res, "Song exist in collection", 400);

    if (collection.type === "album") {
      if (!song.createdBy.equals(collection.createdBy)) {
        return errorResponse(
          res,
          "Song and collection creator didn't Match",
          400,
        );
      }
    }

    if (collection.type === "playlist") {
      const isCreator = collection.createdBy.equals(userId);
      const isCollaborator = collection.collaborators.some((id) =>
        id.equals(userId),
      );
      if (!isCreator && !isCollaborator) {
        collection.collaborators.push(userId);
      }
    }

    collection.songs.push({
      song: songId,
      addedBy: userId,
    });
    await collection.save();
    return successResponse(res, "Song added to collection", 200, collection);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Collection Update Failed", 500);
  }
};

export const removeSongFromCollection = async (req, res) => {
  try {
    const { songId, collectionId } = req.params;
    const userId = req.user._id;
    const collection = await Collection.findById(collectionId);
    if (!collection) return errorResponse(res, "Collection not Found", 404);

    const isCreator = collection.createdBy.equals(userId);
    const isCollaborator = collection.collaborators.some((id) =>
      id.equals(userId),
    );

    if (collection.type === "album" && !isCreator && !isCollaborator)
      return errorResponse(res, "Unauthorized", 403);

    const exist = validateSongInCollection(collection, songId);
    if (exist) {
      const updatedCollection = await Collection.findByIdAndUpdate(
        collectionId,
        {
          $pull: { songs: { song: songId } },
        },
        { new: true },
      );
      return successResponse(
        res,
        "Song removed from collection",
        200,
        updatedCollection,
      );
    } else return errorResponse(res, "Song didnt exist in collection", 404);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Collection Update Failed", 500);
  }
};
