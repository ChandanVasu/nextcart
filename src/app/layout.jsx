import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainHeaderWrapper from "@/components/template/MainHeaderWrapper";
import MainFooterWrapper from "@/components/template/MainFooterWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NextCart - Online Shopify",
  description: "NextCart is a modern online shopping experience built with Next.js and Shopify.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MainHeaderWrapper /> {children} <MainFooterWrapper />
      </body>
    </html>
  );
}
