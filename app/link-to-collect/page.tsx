import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link / Collect - Invoice collection for Link",
  description:
    "Collect, organize, and export supplier invoices for every purchase made through Link.",
};

export default function LinkToCollectPage() {
  return (
    <main className="min-h-screen bg-[#f6f9fc]">
      <iframe
        src="/link-to-collect.html"
        title="Link / Collect - Invoice collection for Link"
        className="h-screen w-full border-0"
      />
    </main>
  );
}
