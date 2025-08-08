// src/app/layout.jsx
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Writing Assistant",
  description: "Generate text with different styles and word counts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Add dark mode class for the background */}
      <body className={`${inter.className} bg-gray-100 dark:bg-slate-900`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}