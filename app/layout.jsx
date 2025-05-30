import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import BackButton from "./components/BackButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="bg-[#432E54] py-4 px-6 shadow-md flex items-center justify-between">
          <BackButton />
          <h1 className="text-white text-lg font-semibold">TV Shows App</h1>
          <Link
            href="/favorites"
            className="bg-white text-[#432E54] font-medium px-4 py-2 rounded-lg shadow hover:bg-[#5c3b73] hover:text-white transition duration-200"
          >
            Favorites
          </Link>
        </div>

        {children}
      </body>
    </html>
  );
}
