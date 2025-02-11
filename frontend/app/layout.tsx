import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers/providers";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";

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
      <body className="bg-background text-foreground">
        <Providers>
          <Header />
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
