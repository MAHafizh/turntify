export default function PlaylistSkeleton() {
  return Array.from({ length: 20 }).map((_, i) => (
    <div key={i} className="rounded-md flex items-center gap-3">
      <div className="w-10 h-10 bg-zinc-800 rounded-md shrink-0 animate-pulse" />
      <div className="flex-1 min-w-0 hidden md:block space-y-2">
        <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-zinc-800 rounded animate-pulse w-1/2" />
      </div>
    </div>
  ));
}
