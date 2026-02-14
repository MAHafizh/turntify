// seeds/albumSeeder.js
import mongoose from "mongoose";
import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import dotenv from "dotenv";

dotenv.config();

const albumsData = [
  {
    title: "Echoes of the Heart",
    artist: "Sarah Mitchell",
    imageUrl: "/albums/1.jpg",
    releaseYear: 2023,
    songTitles: ["Stay With Me"], // Song titles yang akan dicari di DB
  },
  {
    title: "Midnight Sessions",
    artist: "The Wanderers",
    imageUrl: "/albums/2.jpg",
    releaseYear: 2022,
    songTitles: ["Midnight Drive", "City Rain"],
  },
  {
    title: "Tokyo Nights",
    artist: "Electric Dreams",
    imageUrl: "/albums/3.jpg",
    releaseYear: 2024,
    songTitles: ["Lost in Tokyo", "Neon Tokyo"],
  },
  {
    title: "Coastal Vibes",
    artist: "Coastal Kids",
    imageUrl: "/albums/4.jpg",
    releaseYear: 2023,
    songTitles: ["Summer Daze", "Ocean Waves"],
  },
  {
    title: "Neon Dreams Collection",
    artist: "Night Runners",
    imageUrl: "/albums/5.jpg",
    releaseYear: 2022,
    songTitles: ["Neon Lights", "Neon Dreams"],
  },
  {
    title: "Wild Journey",
    artist: "The Wild Ones",
    imageUrl: "/albums/6.jpg",
    releaseYear: 2021,
    songTitles: ["Mountain High"],
  },
  {
    title: "Urban Stories",
    artist: "Urban Echo",
    imageUrl: "/albums/7.jpg",
    releaseYear: 2023,
    songTitles: ["City Rain", "Urban Jungle"],
  },
  {
    title: "Desert Tales",
    artist: "Sahara Sons",
    imageUrl: "/albums/8.jpg",
    releaseYear: 2022,
    songTitles: ["Desert Wind"],
  },
  {
    title: "Ocean Dreams",
    artist: "Coastal Drift",
    imageUrl: "/albums/9.jpg",
    releaseYear: 2024,
    songTitles: ["Ocean Waves"],
  },
  {
    title: "Starlight Sessions",
    artist: "Luna Bay",
    imageUrl: "/albums/10.jpg",
    releaseYear: 2023,
    songTitles: ["Starlight", "Moonlight Dance"],
  },
  {
    title: "Winter Tales",
    artist: "Arctic Pulse",
    imageUrl: "/albums/11.jpg",
    releaseYear: 2021,
    songTitles: ["Winter Dreams"],
  },
  {
    title: "Sunset Dreams",
    artist: "Dream Valley",
    imageUrl: "/albums/12.jpg",
    releaseYear: 2024,
    songTitles: ["Purple Sunset", "Crystal Rain"],
  },
  {
    title: "Cyber Nights",
    artist: "Cyber Pulse",
    imageUrl: "/albums/13.jpg",
    releaseYear: 2023,
    songTitles: ["Neon Dreams"],
  },
  {
    title: "Shadow Dance",
    artist: "Silver Shadows",
    imageUrl: "/albums/14.jpg",
    releaseYear: 2022,
    songTitles: ["Moonlight Dance"],
  },
  {
    title: "City Lights",
    artist: "City Lights",
    imageUrl: "/albums/15.jpg",
    releaseYear: 2023,
    songTitles: ["Urban Jungle"],
  },
  {
    title: "Echo Valley",
    artist: "Echo Valley",
    imageUrl: "/albums/16.jpg",
    releaseYear: 2024,
    songTitles: ["Crystal Rain"],
  },
  {
    title: "Future Sounds",
    artist: "Future Pulse",
    imageUrl: "/albums/17.jpg",
    releaseYear: 2023,
    songTitles: ["Neon Tokyo", "Lost in Tokyo"],
  },
  {
    title: "Midnight Jazz",
    artist: "Jazz Cats",
    imageUrl: "/albums/18.jpg",
    releaseYear: 2021,
    songTitles: ["Midnight Blues"],
  },
];

const seedAlbums = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📦 Connected to MongoDB");
    console.log("🔗 Database:", mongoose.connection.name);

    // Ambil semua songs dari database
    const allSongs = await Song.find();

    if (allSongs.length === 0) {
      console.error("❌ No songs found! Please run song seeder first.");
      console.log("💡 Run: node src/seeds/songSeeder.js");
      return;
    }

    console.log(`\n✅ Found ${allSongs.length} songs in database`);

    // Helper function: konversi song titles ke song IDs
    const getSongIds = (titles) => {
      const foundSongs = allSongs.filter((song) =>
        titles.some(
          (t) => t.trim().toLowerCase() === song.title.trim().toLowerCase(),
        ),
      );

      if (foundSongs.length !== titles.length) {
        const foundTitles = foundSongs.map((s) => s.title.toLowerCase());
        const missingSongs = titles.filter(
          (t) => !foundTitles.includes(t.trim().toLowerCase()),
        );

        if (missingSongs.length > 0) {
          console.warn(`⚠️  Missing songs: ${missingSongs.join(", ")}`);
        }
      }

      // Return dalam format yang sesuai schema: [{ song: ObjectId }]
      return foundSongs.map((song) => song._id);
    };

    // Convert albums data
    const albums = albumsData.map((albumData) => {
      const { songTitles, ...rest } = albumData;

      return {
        ...rest,
        songs: getSongIds(songTitles),
      };
    });

    // Delete old albums
    await Album.deleteMany({});
    console.log("\n🗑️  Old albums deleted");

    // Insert new albums
    const insertedAlbums = await Album.insertMany(albums);
    console.log(`✅ ${insertedAlbums.length} albums seeded successfully!`);

    // Show sample with populated songs
    const sampleAlbum = await Album.findOne().populate({
      path: "songs.song",
      select: "title performer duration",
    });

    console.log("\n✅ Album seeding completed! 🎉");
  } catch (error) {
    console.error("❌ Error seeding albums:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n📦 Disconnected from MongoDB");
  }
};

seedAlbums();
