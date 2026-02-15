import mongoose from "mongoose";
import { Genre } from "../models/genre.model.js";
import { config } from "dotenv";

config();

const genres = [
  { title: "Pop" },
  { title: "Rock" },
  { title: "Jazz" },
  { title: "Classic" },
  { title: "Blues" },
  { title: "Hip-Hop" },
  { title: "Electronic" },
  { title: "Indie-Pop" },
  { title: "Alternative Rock" },
  { title: "Synthwave" },
  { title: "Folk-Rock" },
  { title: "Alternative" },
  { title: "World-Music" },
  { title: "Chillwave" },
  { title: "Dream-Pop" },
  { title: "Ambient" },
  { title: "Indie-Folk" },
  { title: "Synthpop" },
  { title: "Downtempo" },
  { title: "Trap" },
  { title: "Shoegaze" },
  { title: "J-Pop" },
  { title: "K-Pop" },
  { title: "Smooth-Jazz" },
  { title: "Americana" },
  { title: "Acoustic" },
  { title: "Trip-Hop" },
  { title: "Urban" },
  { title: "Retro" },
  { title: "Surf-Rock" },
  { title: "Ethnic" },
];

const seedGenre = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Genre.deleteMany({});
    await Genre.insertMany(genres);
    console.log("Genre seeded successfully!");
  } catch (error) {
    console.error("Error seeding genre:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedGenre();