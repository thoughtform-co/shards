import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  SPOTIFY_CLIENT_ID: z.string().min(1).optional(),
  SPOTIFY_CLIENT_SECRET: z.string().min(1).optional(),
});

type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | null = null;

export function env() {
  if (!cachedEnv) {
    cachedEnv = envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
      SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
      SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    });
  }

  return cachedEnv;
}

export function hasImageToSpotifyKeys() {
  const values = env();

  return Boolean(
    values.ANTHROPIC_API_KEY &&
      values.SPOTIFY_CLIENT_ID &&
      values.SPOTIFY_CLIENT_SECRET,
  );
}
