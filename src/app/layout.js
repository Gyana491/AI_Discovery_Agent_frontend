import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationHeader from "../components/NavigationHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "What's Trending?",
  description: "Discover trending content across GitHub, HuggingFace, and more",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} vsc-initialized `}>
        <NavigationHeader />
        {children}
      </body>
    </html>
  );
}
