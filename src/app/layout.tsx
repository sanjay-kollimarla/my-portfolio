import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--font-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kollimarla Sai Sanjay — Software Engineer",
  description:
    "Software Engineer building scalable backend systems, distributed services and multi-tenant SaaS with Node.js, TypeScript, MongoDB, Redis and AWS.",
  keywords: [
    "Kollimarla Sai Sanjay",
    "Software Engineer",
    "Backend Engineer",
    "Node.js",
    "TypeScript",
    "System Design",
    "Portfolio",
  ],
  authors: [{ name: "Kollimarla Sai Sanjay" }],
};

export const viewport: Viewport = {
  themeColor: "#0a0c12",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${serif.variable} ${jetbrains.variable} antialiased`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
