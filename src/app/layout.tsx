import type { Metadata, Viewport } from "next";
import "./globals.css";
import StoreLayout from "@/components/common/StoreLayout";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0B1322",
};

export const metadata: Metadata = {
  title: "Hassan Optics | Clear Vision • Better Life | Mianwali",
  description:
    "Hassan Optics (Faisal Plaza, Gulburg Chowk, Mianwali) - Premium ready-to-wear frames, blue-cut computer protection glasses, polarized sunglasses & cosmetic contact lenses with nationwide Cash on Delivery (COD).",
  icons: {
    icon: "/images/hassan-logo.png",
    apple: "/images/hassan-logo.png",
  },
  keywords: [
    "Hassan Optics",
    "Mianwali Optician",
    "Faisal Plaza Mianwali",
    "Blue light glasses Pakistan",
    "Eyeglasses Mianwali",
    "Sunglasses Cash on Delivery",
    "Contact Lenses Pakistan",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-slate-900 selection:bg-[#F15A24] selection:text-white font-sans">
        <StoreLayout>{children}</StoreLayout>
      </body>
    </html>
  );
}
