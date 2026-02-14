import LoginPrompt from "@/components/LoginPrompt";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { Disc3, DotIcon, Music, Play, Users } from "lucide-react";
import { useEffect } from "react";

export default function RightSidebar() {
  const { users, fetchUser } = useChatStore();

  const { user } = useUser();

  useEffect(() => {
    if (user) fetchUser();
  }, [users, fetchUser, user]);

  return (
    <div className="h-[calc(100vh-130px)] bg-zinc-900 rounded-md flex flex-col p-4 ">
      {user ? (
        <div>
          <div className="flex flex-col justify-between border-zinc-800 border-b">
            <div className="flex flex-row gap-2 items-center mb-2">
              <Users className="size-5 shrink-0" />
              <h2 className="font-medium truncate">
                What they're listening to
              </h2>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex cursor-pointer hover:bg-zinc-800/50 rounded-lg p-3 gap-3 transition-colors group"
                >
                  <div className="flex">
                    <Avatar className="size-10 block group-hover:hidden">
                      <AvatarImage
                        src={user.imageUrl}
                        alt={user.fullName}
                      />
                    </Avatar>
                    <Play className="items-center mt-2 mx-2 hidden group-hover:block" />
                  </div>
                  <div>
                    <h1 className="text-sm font-medium truncate leading-3">
                      {user.fullName}
                    </h1>
                    <h2 className="flex font-extralight text-sm  items-center">
                      Now Playing <DotIcon /> <span>The Artist</span>
                    </h2>
                    <h2 className="text-sm font-extralight leading-3 flex gap-1.5">
                      <span>
                        <Disc3 className="size-3" />
                      </span>
                      The Album
                    </h2>
                  </div>
                  <div className="flex-col ml-auto items-start">
                    <Music className="size-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <LoginPrompt />
      )}
    </div>
  );
}
