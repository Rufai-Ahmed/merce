import TopBanner from "@/components/layout/Banner/TopBanner";
import Footer from "@/components/layout/Footer";
import TopNavbar from "@/components/layout/Navbar/TopNavbar";
import { satoshi } from "@/styles/fonts";
import "@/styles/globals.css";
import HolyLoader from "holy-loader";
import type { Viewport } from "next";
import Providers from "./providers";



export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={satoshi.className}>
        <HolyLoader color="#868686" />
        <TopBanner />
        <Providers>
          <TopNavbar />
          {children}
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
