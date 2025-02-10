import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RSS Scraper",
  description:
    "A lightweight tool that fetches and extracts posts from any RSS feed, providing a clean and structured view of the latest updates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
