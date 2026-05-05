import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Access — Shards",
  description: "Enter the access key to view the Shards lab.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginForm />;
}
