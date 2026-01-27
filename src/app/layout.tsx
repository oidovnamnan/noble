import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";

export const metadata: Metadata = {
  title: "Noble Consulting | Боловсрол, Аялал, Ажил, Виз",
  description: "Боловсрол, аялал жуулчлал, ажлын зуучлал, визийн зөвлөгөөний мэргэжлийн үйлчилгээ",
  keywords: ["виз", "боловсрол", "аялал", "ажлын зуучлал", "Монгол", "гадаад"],
  authors: [{ name: "Noble Consulting" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

