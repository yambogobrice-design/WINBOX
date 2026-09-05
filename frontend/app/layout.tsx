import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WINBOX",
  description: "WinBox est une plateforme académique conçue pour aider les étudiants à mieux préparer leurs examens et à progresser dans leurs études.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en" data-theme="light"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
