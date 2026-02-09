import { Library } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import PlaylistSkeleton from "./skeletons/PlaylistSkeleton";

export default function LibraryMenu() {
  const isEmpty = false;

  return (
    <div className="rounded-sm bg-zinc-900 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-white px-1 font-medium">
          <Library className="size-6 mr-2" />
          <h1 className="hidden md:inline">Library</h1>
        </div>
      </div>
      <ScrollArea className="rounded-md border px-1 py-4 h-[calc(100vh-300px)] border-hidden">
        <div className="space-y-2">
          {isEmpty ? <div>Create Playlist</div> : <PlaylistSkeleton />}
        </div>
      </ScrollArea>
    </div>
  );
}
