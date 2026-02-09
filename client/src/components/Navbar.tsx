import { SignedOut, SignedIn, SignOutButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router";
import SIgnInOauthButton from "./SIgnInOauthButton";

export default function Navbar() {
  const isAdmin = false;
  return (
    <>
      <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900 backdrop-blur-md z-10">
        <div className="flex gap-2 items-center text-white">Spotify Logo</div>
        <div className="flex gap-4 items-center">
          {isAdmin && (
            <Link className="flex text-white" to={"/admin"}>
              <LayoutDashboardIcon className="size-4 mr-2" />
              Admin Dashboard
            </Link>
          )}

          <SignedIn>
            <SignOutButton />
          </SignedIn>

          <SignedOut>
            <SIgnInOauthButton />
          </SignedOut>
        </div>
      </div>
    </>
  );
}
