import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import PageTransition from "@/Components/PageTransition";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: {
    default: "WINBOX",
    template: "%s | WINBOX"
  },
  description: "WinBox est une plateforme académique conçue pour aider les étudiants à mieux préparer leurs examens et à progresser dans leurs études. Accédez à des cours, livres, sujets et corrections.",
  keywords: ["éducation", "cours", "examens", "étudiants", "révision", "académique", "winbox"],
  authors: [{ name: "YAMBOGO BRICE" }],
  creator: "YAMBOGO BRICE",
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    title: 'WINBOX - Plateforme académique',
    description: 'Plateforme collaborative pour étudiants',
    siteName: 'WINBOX',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr" 
      data-theme="light"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="min-h-full flex flex-col">
        {/* État d'authentification partagé par toute l'application */}
        <AuthProvider>
          <NavBar />
          <PageTransition>
            <main className="flex-1">
              {children}
            </main>
          </PageTransition>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
