import { HeadphonesIcon } from "lucide-react";

export default function LoginPrompt() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="relative">
        <div
          className="absolute -inset-1 bg-linear-to-r from-emerald-500 to-sky-500 rounded-full blur-lg opacity-75 animate-pulse"
          aria-hidden="true"
        ></div>
        <div className="relative bg-zinc-900 rounded-full p-4">
          <HeadphonesIcon className="text-emerald-400 animate-pulse" />
        </div>
      </div>
      <div className="space-y-2 max-w-62.5">
        <h3 className="text-lg font-semibold text-white">
          See What Friends Are Playing
        </h3>
        <p className="text-sm text-zinc-400">
          Login to discover what music your friends are enjoying right now
        </p>
      </div>
    </div>
  );
}
