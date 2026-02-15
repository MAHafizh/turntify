import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import FeaturedSong from "@/components/FeaturedSongs";
import MadeForYouSongs from "@/components/MadeForYouSongs";
import TrendingSongs from "@/components/TrendingSongs";

export default function Homepage() {
  const { fetchFeatured, featured, madeForYou, fetchMadeForYou, trending, fetchTrending } = useMusicStore();

  useEffect(() => {
    fetchFeatured();
    fetchMadeForYou()
    fetchTrending()
  }, [fetchFeatured, fetchMadeForYou, fetchTrending]);

  return (
    <div className="min-h-full">
      <div className="relative p-4">
        <FeaturedSong featured={featured} />
        <MadeForYouSongs madeForYou={madeForYou}/>
        <TrendingSongs trending={trending}/>
      </div>
    </div>
  );
}
