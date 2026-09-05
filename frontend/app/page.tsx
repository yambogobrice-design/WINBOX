import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-b border-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texte */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-black/5 border border-black/10 rounded-full text-sm">
                 Plateforme académique
              </div>
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
                >
                  Commencer maintenant
                </Link>
                <Link
                  href="/Contribuer"
                  className="px-8 py-4 border border-black/20 font-medium rounded-md hover:bg-black/5 transition-all text-center"
                >
                  Contribuer
                </Link>
              </div>
            </div>

            {/* Image/Visual */}
            <div className="relative h-96 bg-black/5 border border-black/10 rounded-lg flex items-center justify-center">
              <Image
                src="/Logo_winbox.jpg"
                alt="WinBox"
                width={200}
                height={200}
                className="rounded-lg"
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
            {/* Feature 1 */}
            <Link
              href="/Livres"
              className="p-6 bg-black/5 border border-black/10 rounded-lg hover:bg-black/10 transition-all group"
            >
              <div className="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-black/20 transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Livres</h3>
              <p className="text-black/60 text-sm">
                Bibliothèque complète de manuels et ouvrages de référence
              </p>
            </Link>

            {/* Feature 2 */}
            <Link
              href="/Cours&Supports"
              className="p-6 bg-black/5 border border-black/10 rounded-lg hover:bg-black/10 transition-all group"
            >
              <div className="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-black/20 transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Cours & Supports</h3>
              <p className="text-black/60 text-sm">
                Notes de cours, fiches de révision et supports pédagogiques
              </p>
            </Link>

            {/* Feature 3 */}
            <Link
              href="/Sujets"
              className="p-6 bg-black/5 border border-black/10 rounded-lg hover:bg-black/10 transition-all group"
            >
              <div className="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-black/20 transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sujets d&apos;examens</h3>
              <p className="text-black/60 text-sm">
                Anciens sujets et exercices types pour mieux vous préparer
              </p>
            </Link>

            {/* Feature 4 */}
            <Link
              href="/Corrections"
              className="p-6 bg-black/5 border border-black/10 rounded-lg hover:bg-black/10 transition-all group"
            >
              <div className="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-black/20 transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Corrections</h3>
              <p className="text-black/60 text-sm">
                Solutions détaillées et corrigés pour progresser
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* WinZone */}
            <Link
              href="/WinZone"
              className="relative p-8 bg-gradient-to-br from-black/10 to-black/5 border border-black/10 rounded-lg hover:from-black/15 hover:to-black/10 transition-all group overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 bg-black/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-black/20 transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">WinZone</h3>
                <p className="text-black/60 mb-4">
                  Testez vos connaissances avec des quiz interactifs et des défis académiques
                </p>
                <span className="inline-flex items-center text-sm font-medium">
                  Explorer
                  <svg
                    className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>

            {/* WinRank */}
            <Link
              href="/WinRank"
              className="relative p-8 bg-gradient-to-br from-black/10 to-black/5 border border-black/10 rounded-lg hover:from-black/15 hover:to-black/10 transition-all group overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 bg-black/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-black/20 transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">WinRank</h3>
                <p className="text-black/60 mb-4">
                  Découvrez votre classement et comparez vos performances avec la communauté
                </p>
                <span className="inline-flex items-center text-sm font-medium">
                  Voir le classement
                  <svg
                    className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>
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
          >
            Contribuer maintenant
          </Link>
        </div>
      </section>
    </div>
  );
}
