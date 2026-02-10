import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";
import { Genre } from "../models/genre.model.js";

config();

const songsData = [
  {
    title: "Stay With Me",
    performer: "Sarah Mitchell",
    writer: "Sarah Mitchell",
    publisher: "Indie Records",
    releaseYear: 2023,
    genreTitles: ["Pop", "Indie Pop"], // Temporary field
    imageUrl: "/cover-images/1.jpg",
    audioUrl: "/songs/1.mp3",
    duration: 46,
  },
  {
    title: "Midnight Drive",
    performer: "The Wanderers",
    writer: "Jake Thompson",
    publisher: "Sunset Music",
    releaseYear: 2022,
    genreTitles: ["Rock", "Alternative Rock"],
    imageUrl: "/cover-images/2.jpg",
    audioUrl: "/songs/2.mp3",
    duration: 41,
  },
  {
    title: "Lost in Tokyo",
    performer: "Electric Dreams",
    writer: "Yuki Tanaka",
    publisher: "Tokyo Beats",
    releaseYear: 2024,
    genreTitles: ["Electronic", "Synthwave", "J-Pop"],
    imageUrl: "/cover-images/3.jpg",
    audioUrl: "/songs/3.mp3",
    duration: 24,
  },
  {
    title: "Summer Daze",
    performer: "Coastal Kids",
    writer: "Alex Rivera",
    publisher: "Beach House Records",
    releaseYear: 2023,
    genreTitles: ["Indie Pop", "Surf Rock"],
    imageUrl: "/cover-images/4.jpg",
    audioUrl: "/songs/4.mp3",
    duration: 24,
  },
  {
    title: "Neon Lights",
    performer: "Night Runners",
    writer: "Chris Park",
    publisher: "Nightlife Music",
    releaseYear: 2022,
    genreTitles: ["Synthwave", "Electronic", "Retro"],
    imageUrl: "/cover-images/5.jpg",
    audioUrl: "/songs/5.mp3",
    duration: 36,
  },
  {
    title: "Mountain High",
    performer: "The Wild Ones",
    writer: "Montana Smith",
    publisher: "Peak Records",
    releaseYear: 2021,
    genreTitles: ["Folk Rock", "Americana"],
    imageUrl: "/cover-images/6.jpg",
    audioUrl: "/songs/6.mp3",
    duration: 40,
  },
  {
    title: "City Rain",
    performer: "Urban Echo",
    writer: "Emma Chen",
    publisher: "Metro Sounds",
    releaseYear: 2023,
    genreTitles: ["Alternative", "Indie Rock"],
    imageUrl: "/cover-images/7.jpg",
    audioUrl: "/songs/7.mp3",
    duration: 39,
  },
  {
    title: "Desert Wind",
    performer: "Sahara Sons",
    writer: "Ahmed Hassan",
    publisher: "Desert Rose Music",
    releaseYear: 2022,
    genreTitles: ["World Music", "Ethnic", "Ambient"],
    imageUrl: "/cover-images/8.jpg",
    audioUrl: "/songs/8.mp3",
    duration: 28,
  },
  {
    title: "Ocean Waves",
    performer: "Coastal Drift",
    writer: "Marina Lopez",
    publisher: "Wave Records",
    releaseYear: 2024,
    genreTitles: ["Chillwave", "Ambient", "Electronic"],
    imageUrl: "/cover-images/9.jpg",
    audioUrl: "/songs/9.mp3",
    duration: 28,
  },
  {
    title: "Starlight",
    performer: "Luna Bay",
    writer: "Luna Bay",
    publisher: "Stellar Music",
    releaseYear: 2023,
    genreTitles: ["Dream Pop", "Shoegaze"],
    imageUrl: "/cover-images/10.jpg",
    audioUrl: "/songs/10.mp3",
    duration: 30,
  },
  {
    title: "Winter Dreams",
    performer: "Arctic Pulse",
    writer: "Nordic Storm",
    publisher: "Ice Records",
    releaseYear: 2021,
    genreTitles: ["Ambient", "Downtempo", "Chillout"],
    imageUrl: "/cover-images/11.jpg",
    audioUrl: "/songs/11.mp3",
    duration: 29,
  },
  {
    title: "Purple Sunset",
    performer: "Dream Valley",
    writer: "Violet Sky",
    publisher: "Horizon Music",
    releaseYear: 2024,
    genreTitles: ["Indie Folk", "Acoustic"],
    imageUrl: "/cover-images/12.jpg",
    audioUrl: "/songs/12.mp3",
    duration: 17,
  },
  {
    title: "Neon Dreams",
    performer: "Cyber Pulse",
    writer: "Tech Noir",
    publisher: "Digital Wave",
    releaseYear: 2023,
    genreTitles: ["Synthpop", "Electronic", "Dance"],
    imageUrl: "/cover-images/13.jpg",
    audioUrl: "/songs/13.mp3",
    duration: 39,
  },
  {
    title: "Moonlight Dance",
    performer: "Silver Shadows",
    writer: "Diana Moon",
    publisher: "Lunar Records",
    releaseYear: 2022,
    genreTitles: ["Downtempo", "Trip Hop", "Electronic"],
    imageUrl: "/cover-images/14.jpg",
    audioUrl: "/songs/14.mp3",
    duration: 27,
  },
  {
    title: "Urban Jungle",
    performer: "City Lights",
    writer: "Marcus Steel",
    publisher: "Concrete Music",
    releaseYear: 2023,
    genreTitles: ["Hip Hop", "Trap", "Urban"],
    imageUrl: "/cover-images/15.jpg",
    audioUrl: "/songs/15.mp3",
    duration: 36,
  },
  {
    title: "Crystal Rain",
    performer: "Echo Valley",
    writer: "Crystal Waters",
    publisher: "Echo Music Group",
    releaseYear: 2024,
    genreTitles: ["Shoegaze", "Dream Pop", "Alternative"],
    imageUrl: "/cover-images/16.jpg",
    audioUrl: "/songs/16.mp3",
    duration: 39,
  },
  {
    title: "Neon Tokyo",
    performer: "Future Pulse",
    writer: "Akira Yamamoto",
    publisher: "Future Sounds",
    releaseYear: 2023,
    genreTitles: ["J-Pop", "Electronic", "Synthwave"],
    imageUrl: "/cover-images/17.jpg",
    audioUrl: "/songs/17.mp3",
    duration: 39,
  },
  {
    title: "Midnight Blues",
    performer: "Jazz Cats",
    writer: "Miles Blue",
    publisher: "Blue Note Records",
    releaseYear: 2021,
    genreTitles: ["Jazz", "Blues", "Smooth Jazz"],
    imageUrl: "/cover-images/18.jpg",
    audioUrl: "/songs/18.mp3",
    duration: 29,
  },
];

const seedSongs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to db", mongoose.connection.name);

    const allGenres = await Genre.find();
    
    if (allGenres.length === 0) {
      console.error("no genres found");
      return;
    }

    console.log(`found ${allGenres.length} genres in database`);
    
    console.log("genres in DB:");
    allGenres.forEach((g, i) => {
      console.log(`  ${i + 1}. "${g.title}"`);
    });

    const getGenreIds = (titles) => {
      const foundGenres = allGenres.filter(genre => 
        titles.some(t => t.trim().toLowerCase() === genre.title.trim().toLowerCase())
      );

      if (foundGenres.length !== titles.length) {
        const foundTitles = foundGenres.map(g => g.title.toLowerCase());
        const missingGenres = titles.filter(t => 
          !foundTitles.includes(t.trim().toLowerCase())
        );
        
        if (missingGenres.length > 0) {
          console.warn(`missing genre: ${missingGenres.join(', ')}`);
        }
      }

      return foundGenres.map(genre => genre._id);
    };

    const songs = songsData.map(songData => {
      const { genreTitles, ...rest } = songData;
      return {
        ...rest,
        genre: getGenreIds(genreTitles)
      };
    });

    await Song.deleteMany({});
    console.log("\nold songs deleted");

    const insertedSongs = await Song.insertMany(songs);
    console.log(`${insertedSongs.length} songs seeded!`);


  } catch (error) {
    console.error("error seeding songs:", error);
  } finally {
    await mongoose.connection.close();
    console.log("disconnected from db");
  }
};

seedSongs();
