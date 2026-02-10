import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertToMinute } from "@/lib/convertToMinute";
import { useMusicStore } from "@/stores/useMusicStore";
import { Clock3, Dot, Play } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router";

export default function AlbumPage() {
  const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
  const { albumId } = useParams();

  useEffect(() => {
    if (albumId) fetchAlbumById(albumId);
  }, [fetchAlbumById, albumId]);

  if (isLoading) return null;
  console.log(currentAlbum);
  return (
    <div className="h-[calc(100vh-130px)]">
      <ScrollArea className="h-[calc(100vh-130px)]">
        <div
          className="absolute inset-0 bg-linear-to-b from-[#5038a0]/80 top-0 via-zinc-900/80 to-zinc-900 pointer-events-none h-[calc(100vh-130px)] rounded-sm"
          aria-hidden="true"
        />
        <div className="relative">
          <div className="relative z-10 ">
            <div className="flex p-4 gap-4">
              <img
                src="https://res.cloudinary.com/dc4k7fypt/image/upload/v1770652127/image-music_okmrp5.jpg"
                alt={currentAlbum?.title}
                className="w-50 h-50 shadow-2xl rounded-sm"
              />
              <div className="flex flex-col justify-end gap-3">
                <p className="text-sm font-bold">Album</p>
                <h1 className="text-6xl h-18 font-medium truncate">
                  {currentAlbum?.title}
                </h1>
                <div className="flex items-center text-lg">
                  <span className="text-lg font-medium">
                    {currentAlbum?.artist}
                  </span>
                  <Dot size={30} />
                  <span>{currentAlbum?.releaseYear}</span>
                  <Dot size={30} />
                  <span>{currentAlbum?.songs.length} songs</span>
                </div>
              </div>
            </div>

            <div className="flex-col p-4 bg-linear-to-b from-black/20 via-black/35 to-black/60 backdrop-blur-sm h-[calc(100vh-362px)]">
              <Button className="rounded-full size-16 bg-green-500 hover:bg-green-400 hover:scale-110 transition-all">
                <Play className="size-6 text-black" />
              </Button>

              <div className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-white/30">
                      <TableHead className="text-white/60 font-light text-md w-10">
                        #
                      </TableHead>
                      <TableHead className="text-white/60 font-light text-md w-60">
                        Title
                      </TableHead>
                      <TableHead className="hidden lg:table-cell text-white/60 font-light text-md w-60 justify-self-end">
                        Plays
                      </TableHead>
                      <TableHead className="hidden lg:table-cell text-white/60 font-light text-md w-60 justify-self-end">
                        Date added
                      </TableHead>
                      <TableHead className="text-white/60 font-light text-md">
                        <Clock3 className="size-3.5" strokeWidth={2} />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentAlbum?.songs.map((song, index) => (
                      <TableRow
                        key={song.song._id}
                        className="hover:bg-white/30 border-0"
                      >
                        <TableCell className="text-white/80 font-normal w-10">
                          {index + 1}
                        </TableCell>
                        <TableCell className="w-60">
                          <div className="flex gap-2">
                            <img
                              src="https://res.cloudinary.com/dc4k7fypt/image/upload/v1770652127/image-music_okmrp5.jpg"
                              className="w-10 h-10"
                              alt=""
                            />
                            <div className="items-center justify-center">
                              <h1 className="text-white text-md">
                                {song.song.title}
                              </h1>
                              <p className="text-white/80">
                                {song.song.performer}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-white/80 font-normal">
                          1.900.000
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-white/80 font-normal">
                          {
                            new Date(song.song.createdAt)
                              .toISOString()
                              .split("T")[0]
                          }
                        </TableCell>
                        <TableCell className="text-white/80 font-normal">
                          {convertToMinute(song.song.duration)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
