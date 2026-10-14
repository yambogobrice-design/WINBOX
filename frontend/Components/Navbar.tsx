"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

// Liens du sous-menu "Ressources"
const liensRessources = [
  { href: "/Livres", label: "Livres" },
  { href: "/Cours&Supports", label: "Cours & Supports" },
  { href: "/Sujets", label: "Sujets d'examens" },
  { href: "/Corrections", label: "Corrections" },
];

const NavBar = () => {
  const router = useRouter();
  const { utilisateur, estConnecte, deconnexion } = useAuthContext();
  const [showRessources, setShowRessources] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.body.style.overflow = menuOuvert ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOuvert]);

  const fermerMenu = () => setMenuOuvert(false);

  const handleDeconnexion = () => {
    deconnexion();
    fermerMenu();
    router.push('/');
  };

  const handleMouseEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setShowRessources(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowRessources(false);
    }, 200);
    setDropdownTimeout(timeout);
  };

  return (
    <>
      <nav className="bg-white text-black border-b border-black/10 sticky top-0 z-50 backdrop-blur-sm bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link prefetch={true} href="/"
                onClick={fermerMenu}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/Logo_winbox.jpg"
                  alt="WinBox Logo"
                  width={60}
                  height={40}
                  className="rounded-md"
                />
                {/* <span className="text-2xl font-bold tracking-tight">WINBOX</span> */}
              </Link>
            </div>

            {/* Menu Desktop */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link prefetch={true} href="/"
                className="px-4 py-2 text-sm font-medium hover:bg-black/5 rounded-md transition-all"
              >
                Accueil
              </Link>

              {/* Dropdown Ressources */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  onClick={() => setShowRessources(!showRessources)}
                  className="px-4 py-2 text-sm font-medium hover:bg-black/5 rounded-md transition-all flex items-center gap-1"
                >
                  Ressources
                  <svg
                    className={`w-4 h-4 transition-transform ${showRessources ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showRessources && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-56 bg-white border border-black/10 rounded-md shadow-2xl overflow-hidden z-50"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {liensRessources.map((lien) => (
                      <Link
                        key={lien.href}
                        href={lien.href}
                        onClick={() => setShowRessources(false)}
                        className="block px-4 py-3 text-sm hover:bg-black/5 transition-colors border-b border-black/5 last:border-0"
                      >
                        {lien.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link prefetch={true} href="/Recherche"
                className="px-4 py-2 text-sm font-medium hover:bg-black/5 rounded-md transition-all"
              >
                Recherche
              </Link>

              {/* Concepteur */}
              <div className="relative group">
                <Link prefetch={true} href="/Apropos"
                  className="px-4 py-2 text-sm font-medium hover:bg-black/5 rounded-md transition-all flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  À propos
                </Link>
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-black/10 rounded-md shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-6">
                    <h3 className="text-sm font-semibold mb-3 text-black">Concepteur & Réalisateur</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-black/20">
                          <Image
                            src="/Photo.png"
                            alt="Créateur WinBox"
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-black">YAMBOGO BRICE</p>
                          <p className="text-xs text-black/60 mt-1">
                            Plateforme développée pour faciliter le partage de ressources académiques
                          </p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-black/10">
                        <p className="text-xs text-black/60 leading-relaxed">
                          WinBox est une initiative étudiante visant à améliorer l&apos;accès aux ressources pédagogiques et à créer une communauté d&apos;entraide.
                        </p>
                      </div>
                      <Link prefetch={true} href="/Apropos"
                        className="block w-full px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-black/90 transition-all text-center mt-4"
                      >
                        En savoir plus →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link prefetch={true} href="/Contribuer"
                className="px-4 py-2 ml-2 text-sm font-medium bg-black text-white hover:bg-black/90 rounded-md transition-all"
              >
                Contribuer
              </Link>
            </div>

            {/* Actions utilisateur */}
            <div className="flex items-center gap-3">
              {/* Avatar Desktop */}
              <div className="hidden lg:block relative group">
                <button className="flex items-center gap-2 p-2 hover:bg-black/5 rounded-full transition-all">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-black/10 rounded-md shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {estConnecte ? (
                    <>
                      {utilisateur && (
                        <div className="px-4 py-3 border-b border-black/5 bg-black/5">
                          <p className="text-sm font-bold text-black truncate">
                            {utilisateur.prenom} {utilisateur.nom}
                          </p>
                          <p className="text-xs text-black/60 truncate">{utilisateur.email}</p>
                        </div>
                      )}
                      <Link prefetch={true} href="/Profil"
                        className="block px-4 py-3 text-sm hover:bg-black/5 transition-colors border-b border-black/5"
                      >
                        Profil
                      </Link>
                      <Link prefetch={true} href="/Favoris"
                        className="block px-4 py-3 text-sm hover:bg-black/5 transition-colors border-b border-black/5"
                      >
                        Mes Favoris
                      </Link>
                      {utilisateur?.role === "admin" && (
                        <Link prefetch={true} href="/Admin/Dashboard"
                          className="block px-4 py-3 text-sm hover:bg-black/5 transition-colors border-b border-black/5"
                        >
                          Administration
                        </Link>
                      )}
                      <button 
                        onClick={handleDeconnexion}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-black/5 transition-colors text-black/60"
                      >
                        Déconnexion
                      </button>
                    </>
                  ) : (
                    <>
                      <Link prefetch={true} href="/Connexion"
                        className="block px-4 py-3 text-sm hover:bg-black/5 transition-colors border-b border-black/5 font-medium"
                      >
                        Se connecter
                      </Link>
                      <Link prefetch={true} href="/Inscription"
                        className="block px-4 py-3 text-sm hover:bg-black/5 transition-colors font-medium"
                      >
                        S&apos;inscrire
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Bouton Menu Mobile */}
              <button
                type="button"
                onClick={() => setMenuOuvert(true)}
                aria-label="Ouvrir le menu"
                className="lg:hidden p-2 hover:bg-black/5 rounded-md transition-all"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay Mobile */}
      {menuOuvert && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={fermerMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Mobile */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-black border-l border-black/10 transform transition-transform duration-300 ease-out lg:hidden ${
          menuOuvert ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Menu de navigation"
      >
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/Logo_winbox.jpg"
              alt="WinBox Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="font-bold text-xl tracking-tight">WINBOX</span>
          </div>
          <button
            type="button"
            onClick={fermerMenu}
            aria-label="Fermer le menu"
            className="p-2 hover:bg-black/5 rounded-md transition-all"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Mobile */}
        <nav className="p-6 overflow-y-auto h-full">
          <div className="space-y-1">
            <Link prefetch={true} href="/"
              onClick={fermerMenu}
              className="block px-4 py-3 text-sm font-medium hover:bg-black/5 rounded-md transition-all"
            >
              Accueil
            </Link>

            {/* Ressources académiques */}
            <div className="pt-6 pb-2">
              <p className="px-4 text-xs font-semibold text-black/40 uppercase tracking-wider">
                Ressources académiques
              </p>
            </div>
            {liensRessources.map((lien) => (
              <Link
                key={lien.href}
                href={lien.href}
                onClick={fermerMenu}
                className="block px-4 py-3 text-sm hover:bg-black/5 rounded-md transition-all"
              >
                {lien.label}
              </Link>
            ))}

            {/* Communauté */}
            <div className="pt-6 pb-2">
              <p className="px-4 text-xs font-semibold text-black/40 uppercase tracking-wider">
                Communauté
              </p>
            </div>
            <Link prefetch={true} href="/WinZone"
              onClick={fermerMenu}
              className="block px-4 py-3 text-sm hover:bg-black/5 rounded-md transition-all"
            >
              WinZone
            </Link>
            <Link prefetch={true} href="/WinRank"
              onClick={fermerMenu}
              className="block px-4 py-3 text-sm hover:bg-black/5 rounded-md transition-all"
            >
              WinRank
            </Link>
            <Link prefetch={true} href="/Recherche"
              onClick={fermerMenu}
              className="block px-4 py-3 text-sm hover:bg-black/5 rounded-md transition-all"
            >
              Recherche
            </Link>

            {/* À propos */}
            <div className="pt-6 pb-2">
              <p className="px-4 text-xs font-semibold text-black/40 uppercase tracking-wider">
                À propos
              </p>
            </div>
            <Link prefetch={true} href="/Apropos"
              onClick={fermerMenu}
              className="block px-4 py-3 text-sm hover:bg-black/5 rounded-md transition-all"
            >
              Qui sommes-nous ?
            </Link>
            <div className="px-4 py-4 bg-black/5 rounded-md mx-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">👨‍💻</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-black">Équipe WinBox</p>
                  <p className="text-xs text-black/60 mt-1">
                    Concepteur & Réalisateur
                  </p>
                </div>
              </div>
              <p className="text-xs text-black/60 leading-relaxed mb-3">
                Plateforme développée pour faciliter le partage de ressources académiques et créer une communauté d&apos;entraide.
              </p>
              <Link prefetch={true} href="/Apropos"
                onClick={fermerMenu}
                className="block w-full px-4 py-2 bg-black text-white text-xs font-medium rounded hover:bg-black/90 transition-all text-center"
              >
                En savoir plus →
              </Link>
            </div>

            <Link prefetch={true} href="/Contribuer"
              onClick={fermerMenu}
              className="block px-4 py-3 text-sm bg-black text-white hover:bg-black/90 rounded-md transition-all font-medium"
            >
              Contribuer
            </Link>

            {/* Mon compte */}
            <div className="pt-6 pb-2">
              <p className="px-4 text-xs font-semibold text-black/40 uppercase tracking-wider">
                Mon compte
              </p>
            </div>
            <Link prefetch={true} href="/Profil"
              onClick={fermerMenu}
              className="block px-4 py-3 text-sm hover:bg-black/5 rounded-md transition-all"
            >
              Mon Profil
            </Link>
            <Link prefetch={true} href="/Favoris"
              onClick={fermerMenu}
              className="block px-4 py-3 text-sm hover:bg-black/5 rounded-md transition-all"
            >
              Mes Favoris
            </Link>
          </div>

          {/* Admin & Déconnexion */}
          <div className="mt-8 pt-6 border-t border-black/10 space-y-2">
            {estConnecte ? (
              <>
                {utilisateur?.role === "admin" && (
                  <Link prefetch={true} href="/Admin/Dashboard"
                    onClick={fermerMenu}
                    className="block px-4 py-3 text-sm text-center border border-white/20 hover:bg-black/5 rounded-md transition-all"
                  >
                    Administration
                  </Link>
                )}
                <button 
                  onClick={handleDeconnexion}
                  className="w-full px-4 py-3 text-sm text-center text-black/60 hover:bg-black/5 rounded-md transition-all"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link prefetch={true} href="/Connexion"
                  onClick={fermerMenu}
                  className="block px-4 py-3 text-sm text-center bg-black text-white hover:bg-gray-800 rounded-md transition-all font-medium"
                >
                  Se connecter
                </Link>
                <Link prefetch={true} href="/Inscription"
                  onClick={fermerMenu}
                  className="block px-4 py-3 text-sm text-center border border-white/20 hover:bg-black/5 rounded-md transition-all"
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default NavBar;


