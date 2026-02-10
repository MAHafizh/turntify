import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { Link } from "react-router";

export default function LibraryAlbum() {
  const { albums, fetchAlbums } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  console.log({ albums });
  return (
    <div>
      {albums.map((album) => (
        <Link
          to={`/albums/${album._id}`}
          key={album._id}
          className="flex my-2 gap-4 hover:bg-zinc-700 p-2 rounded-sm"
        >
          <img
            src="https://res.cloudinary.com/dc4k7fypt/image/upload/v1770652127/image-music_okmrp5.jpg"
            alt={album.title}
            className="size-11 rounded-md shrink-0 object-cover"
          />
          <div className="flex-1 hidden sm:block min-w-0">
            <h1 className="font-medium truncate">{album.title}</h1>
            <h2 className="text-sm truncate">{album.artist}</h2>
          </div>
        </Link>
      ))}
    </div>
  );
}
