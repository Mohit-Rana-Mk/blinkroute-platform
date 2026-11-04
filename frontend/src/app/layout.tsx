import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlinkRoute | Minimal Operations Dashboard",
  description: "Minimal, clean, humanized operations telemetry and laboratory console",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f0f2f5] text-zinc-900 antialiased selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
