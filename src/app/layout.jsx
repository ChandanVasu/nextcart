import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import "suneditor/dist/css/suneditor.min.css";

// Load the Poppins font with CSS variable support
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "NextCart - Online Shopping Experience",
  description: "NextCart is a modern online shopping experience built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
