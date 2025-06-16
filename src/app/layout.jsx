import { Rubik } from "next/font/google"; // Changed from Poppins to Rubik
import "./globals.css";
import { Providers } from "./providers";
import "suneditor/dist/css/suneditor.min.css";
import MainFooterWrapper from "@/components/template/MainFooterWrapper";
import MainHeaderWrapper from "@/components/template/MainHeaderWrapper";

// Load the Rubik font with CSS variable support
const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "NextCart - Online Shopping Experience",
  description: "NextCart is a modern online shopping experience built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={rubik.variable}>
      <body className="antialiased">
        <Providers>
          <MainHeaderWrapper />
          {children}
          <MainFooterWrapper />
        </Providers>
      </body>
    </html>
  );
}
