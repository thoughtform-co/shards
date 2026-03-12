import { env } from "@/lib/env";

export type PlaylistTrack = {
  id: string;
  name: string;
  artists: string[];
  albumName: string;
  image: string | null;
  url: string;
  previewUrl: string | null;
};

type SpotifyTrackResult = {
  source: "live" | "mock";
  tracks: PlaylistTrack[];
};

export async function getSpotifyPlaylistPreview(
  artistSeeds: string[],
): Promise<SpotifyTrackResult> {
  if (!hasSpotifyCredentials()) {
    return {
      source: "mock",
      tracks: buildMockTracks(artistSeeds),
    };
  }

  try {
    const accessToken = await getAccessToken();
    const artistIds = await resolveArtistIds(accessToken, artistSeeds);

    if (artistIds.length === 0) {
      return {
        source: "mock",
        tracks: buildMockTracks(artistSeeds),
      };
    }

    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?limit=12&seed_artists=${artistIds.slice(0, 5).join(",")}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error("Spotify recommendations failed");
    }

    const payload = (await response.json()) as {
      tracks?: Array<{
        id: string;
        name: string;
        preview_url: string | null;
        artists?: Array<{ name: string }>;
        album?: {
          name?: string;
          images?: Array<{ url: string }>;
        };
      }>;
    };

    const tracks =
      payload.tracks?.map((track) => ({
        id: track.id,
        name: track.name,
        artists: track.artists?.map((artist) => artist.name) ?? [],
        albumName: track.album?.name ?? "Spotify",
        image: track.album?.images?.[0]?.url ?? null,
        url: `https://open.spotify.com/track/${track.id}`,
        previewUrl: track.preview_url,
      })) ?? [];

    return {
      source: tracks.length > 0 ? "live" : "mock",
      tracks: tracks.length > 0 ? tracks : buildMockTracks(artistSeeds),
    };
  } catch {
    return {
      source: "mock",
      tracks: buildMockTracks(artistSeeds),
    };
  }
}

function hasSpotifyCredentials() {
  const values = env();

  return Boolean(values.SPOTIFY_CLIENT_ID && values.SPOTIFY_CLIENT_SECRET);
}

async function getAccessToken() {
  const values = env();
  const credentials = Buffer.from(
    `${values.SPOTIFY_CLIENT_ID}:${values.SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Spotify token request failed");
  }

  const payload = (await response.json()) as {
    access_token: string;
  };

  return payload.access_token;
}

async function resolveArtistIds(accessToken: string, artistSeeds: string[]) {
  const queries = artistSeeds.slice(0, 5);
  const artistIds: string[] = [];

  for (const query of queries) {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      continue;
    }

    const payload = (await response.json()) as {
      artists?: {
        items?: Array<{ id: string }>;
      };
    };

    const id = payload.artists?.items?.[0]?.id;

    if (id) {
      artistIds.push(id);
    }
  }

  return artistIds;
}

function buildMockTracks(artistSeeds: string[]): PlaylistTrack[] {
  const seeds =
    artistSeeds.length > 0
      ? artistSeeds
      : ["Romy", "Magdalena Bay", "Blood Orange", "KAYTRANADA"];
  const adjectives = [
    "Chrome",
    "Velvet",
    "Neon",
    "Blue",
    "Late",
    "Electric",
    "Soft",
    "Midnight",
  ];
  const nouns = [
    "Operator",
    "Afterglow",
    "Sleeve Notes",
    "Replay",
    "Signal",
    "Motorcade",
    "Mirrorball",
    "Window Light",
  ];

  return seeds.slice(0, 8).map((seed, index) => ({
    id: `mock-${seed}-${index}`,
    name: `${adjectives[index % adjectives.length]} ${nouns[index % nouns.length]}`,
    artists: [seed],
    albumName: "Jukebox Preview",
    image: null,
    url: `https://open.spotify.com/search/${encodeURIComponent(seed)}`,
    previewUrl: null,
  }));
}
