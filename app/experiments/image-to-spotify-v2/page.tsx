import type { Metadata } from "next";
import { JukeboxPageV2 } from "@/experiments/image-to-spotify/ui/v2/JukeboxPageV2";

export const metadata: Metadata = {
  title: "Image to Spotify V2",
  description: "A campus-media jukebox powered by Claude vision and Spotify.",
};

export default function ImageToSpotifyV2Route() {
  return <JukeboxPageV2 />;
}
