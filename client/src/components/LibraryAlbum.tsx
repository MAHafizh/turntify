import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { Link } from "react-router";

export default function LibraryAlbum() {
  const { albums, fetchAlbums } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  return (
    <div>
      {albums.map((album) => (
        <Link
          to={`/albums/${album._id}`}
          key={album._id}
          className="flex my-2 gap-4 hover:bg-zinc-700 p-2 rounded-sm"
        >
          <img
            src={import.meta.env.VITE_DEFAULT_IMAGE}
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
