import type { Metadata } from "next";
import { imageToSpotifyManifest } from "@/experiments/image-to-spotify/manifest";
import { JukeboxPage } from "@/experiments/image-to-spotify/ui/JukeboxPage";

export const metadata: Metadata = {
  title: imageToSpotifyManifest.title,
  description: imageToSpotifyManifest.summary,
};

export default function ImageToSpotifyRoute() {
  return <JukeboxPage />;
}
