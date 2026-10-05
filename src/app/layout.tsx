import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Dhruv Atlas | Polar Science Knowledge Repository & Outreach Portal",
  description:
    "An integrated polar science outreach and knowledge repository covering Antarctica, the Arctic, and the High Mountain Asia / Himalayan region by team g-SAP.",
  keywords: [
    "Polar Science",
    "Antarctica",
    "Arctic",
    "Himalayas",
    "Third Pole",
    "Maitri",
    "Bharati",
    "Himadri",
    "Cryosphere",
    "Open Science",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="bg-archive-white text-expedition-ink font-sans antialiased selection:bg-secondary-container selection:text-expedition-ink">
        {children}
      </body>
    </html>
  );
}
