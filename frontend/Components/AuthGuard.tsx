"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthContext } from "@/contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  message?: string;
}

export default function AuthGuard({ children, message }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  // État d'authentification partagé (AuthProvider monté dans le layout racine) :
  // une connexion est donc immédiatement visible ici, sans rechargement.
  const { estConnecte, chargement } = useAuthContext();

  // Page demandée : on la transmet à la connexion pour y revenir après login.
  const lienConnexion = `/Connexion?redirect=${encodeURIComponent(pathname)}`;

  useEffect(() => {
    // Redirection différée : on laisse le temps de lire le message affiché
    if (chargement || estConnecte) return;

    const redirection = setTimeout(() => {
      router.push(lienConnexion);
    }, 3000);

    // Annule la redirection si l'utilisateur quitte la page entre-temps
    return () => clearTimeout(redirection);
  }, [chargement, estConnecte, router, lienConnexion]);

  // Affichage du chargement
  if (chargement) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <p className="text-black/60 font-medium">Vérification de l&apos;authentification...</p>
        </div>
      </div>
    );
  }

  // Si pas connecté, afficher le message de redirection
  if (!estConnecte) {
    return (
      <div className="min-h-screen bg-white text-black antialiased">
        {/* Grille de fond subtile */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
              {/* Icône */}
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              {/* Message */}
              <h1 className="text-3xl font-black mb-4 tracking-tight">Connexion requise</h1>
              <p className="text-gray-600 font-light mb-8 leading-relaxed">
                {message || "Vous devez être connecté pour accéder à cette page."}
              </p>

              {/* Redirection info */}
              <div className="bg-gray-50 border-2 border-gray-200 p-4 mb-6 text-sm text-gray-700">
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Redirection vers la page de connexion...</span>
                </div>
              </div>

              {/* Boutons */}
              <div className="space-y-3">
                <Link
                  href={lienConnexion}
                  className="block w-full px-6 py-4 bg-black text-white font-black text-sm hover:bg-gray-800 transition-all uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                >
                  Se connecter
                </Link>
                <Link
                  href="/Inscription"
                  className="block w-full px-6 py-3 border-2 border-black text-black font-bold text-sm hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                >
                  Créer un compte
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors font-medium mt-4"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Retour à l&apos;accueil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si connecté, afficher le contenu protégé
  return <>{children}</>;
}
