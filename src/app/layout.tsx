import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import {Navbar} from "@/components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const geistRoboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "MangaNihon",
  keywords: ["manga", "anime", "japonés", "cultura japonesa", "mangas populares"],
  authors: [
    {
      name: "Marcos Muñoz",
      url: "https://twitter.com/marcosmunoz",
    },
  ],
  description:
    "Descubre los mejores mangas y animes en MangaNihon. Tu tienda de confianza para todo lo relacionado con la cultura japonesa.",
  openGraph: {
    title: "MangaNihon",
    description:
      "Descubre los mejores mangas y animes en MangaNihon. Tu tienda de confianza para todo lo relacionado con la cultura japonesa.",
    url: "https://manganiho.com",
    siteName: "MangaNihon",
    locale: "es_ES",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="!scroll-smooth">
      <body
        className={`${geistRoboto.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
