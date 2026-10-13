"use client";
import Link from "next/link";
import Image from "next/image";
import { memo } from "react";

// Composant Feature mémorisé pour éviter les re-renders inutiles
const FeatureCard = memo(({ href, icon, title, description }: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Link
    href={href}
    className="p-6 bg-black/5 border border-black/10 rounded-lg hover:bg-black/10 transition-all group"
  >
    <div className="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-black/20 transition-all">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-black/60 text-sm">{description}</p>
  </Link>
));

FeatureCard.displayName = 'FeatureCard';

// Composant Community Card mémorisé
const CommunityCard = memo(({ href, icon, title, description, cta }: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
}) => (
  <Link
    href={href}
    className="relative p-8 bg-gradient-to-br from-black/10 to-black/5 border border-black/10 rounded-lg hover:from-black/15 hover:to-black/10 transition-all group overflow-hidden"
  >
    <div className="relative z-10">
      <div className="w-16 h-16 bg-black/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-black/20 transition-all">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-black/60 mb-4">{description}</p>
      <span className="inline-flex items-center text-sm font-medium">
        {cta}
        <svg
          className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  </Link>
));

CommunityCard.displayName = 'CommunityCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-b border-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texte */}
            <div className="space-y-6">
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Préparez vos examens avec{" "}
                <span className="text-black/60">excellence</span>
              </h1>
              <p className="text-lg text-black/60 leading-relaxed">
                Accédez à une collection complète de cours, livres, sujets d&apos;examens et corrections pour réussir vos études.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/Recherche"
                  className="px-8 py-4 bg-black text-white font-medium rounded-md hover:bg-black/90 transition-all text-center"
                  prefetch={true}
                >
                  Commencer maintenant
                </Link>
                <Link
                  href="/Contribuer"
                  className="px-8 py-4 border border-black/20 font-medium rounded-md hover:bg-black/5 transition-all text-center"
                  prefetch={false}
                >
                  Contribuer
                </Link>
              </div>
            </div>

            {/* Image/Visual */}
            <div className="relative h-96 bg-black/5 border border-black/10 rounded-lg flex items-center justify-center">
              <Image
                src="/Logo_winbox.jpg"
                alt="Logo WinBox - Plateforme académique"
                width={200}
                height={200}
                className="rounded-lg"
                priority
                quality={85}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-black/60 text-lg">
              Des ressources académiques de qualité pour tous les étudiants
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              href="/Livres"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              title="Livres"
              description="Bibliothèque complète de manuels et ouvrages de référence"
            />

            <FeatureCard
              href="/Cours&Supports"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              title="Cours & Supports"
              description="Notes de cours, fiches de révision et supports pédagogiques"
            />

            <FeatureCard
              href="/Sujets"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
              title="Sujets d'examens"
              description="Anciens sujets et exercices types pour mieux vous préparer"
            />

            <FeatureCard
              href="/Corrections"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Corrections"
              description="Solutions détaillées et corrigés pour progresser"
            />
          </div>
        </div>
      </section>

      

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Rejoignez la communauté WinBox
          </h2>
          <p className="text-lg text-black/60 mb-8">
            Partagez vos ressources, aidez d&apos;autres étudiants et contribuez à une plateforme collaborative
          </p>
          <Link
            href="/Contribuer"
            className="inline-block px-8 py-4 bg-black text-white font-medium rounded-md hover:bg-black/90 transition-all"
            prefetch={false}
          >
            Contribuer maintenant
          </Link>
        </div>
      </section>
    </div>
  );
}
