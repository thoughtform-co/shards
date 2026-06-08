import { imageToSpotifyManifest } from "@/experiments/image-to-spotify/manifest";
import { imageToSpotifyV2Manifest } from "@/experiments/image-to-spotify/manifest-v2";
import { videoStudioManifest } from "@/experiments/video-studio/manifest";

export const experimentRegistry = [
  imageToSpotifyManifest,
  imageToSpotifyV2Manifest,
  videoStudioManifest,
];
