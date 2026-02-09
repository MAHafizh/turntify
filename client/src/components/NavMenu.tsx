import { cn } from "@/lib/utils";
import { HomeIcon, MessageSquare } from "lucide-react";
import { Link } from "react-router";
import { buttonVariants } from "./ui/button";
import { SignedIn } from "@clerk/clerk-react";

export default function NavMenu() {
  return (
    <div className="rounded-sm bg-zinc-900 py-4 px-2">
      <div className="flex-col justify-between">
        <Link
          to={"/"}
          className={cn(
            buttonVariants({
              variant: "ghost",
              className:
                "w-full justify-start hover:text-white hover:bg-zinc-800 rounded-sm items-center",
            }),
          )}
        >
          <HomeIcon className="size-6"/>
          <h1 className="hidden md:inline">Home</h1>
        </Link>
        <SignedIn>
          <Link
            to={"/chat"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className:
                  "w-full justify-start hover:text-white hover:bg-zinc-800 rounded-sm items-center",
              }),
            )}
          >
            <MessageSquare className="size-6"/>
            <h1 className="hidden md:inline">Messages</h1>
          </Link>
        </SignedIn>
      </div>
    </div>
  );
}
