"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

// Liens du sous-menu "Ressources"
const liensRessources = [
  { href: "/Livres", label: "Livres" },
  { href: "/Cours&Supports", label: "Cours & Supports" },
  { href: "/Sujets", label: "Sujets d'examens" },
  { href: "/Corrections", label: "Corrections" },
];

const NavBar = () => {
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
      <nav className="bg-black text-white border-b border-white/10 sticky top-0 z-50 backdrop-blur-sm bg-black/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                onClick={fermerMenu}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/Logo_winbox.jpg"
                  alt="WinBox Logo"
                  width={40}
                  height={40}
                  className="rounded-md"
                />
                <span className="text-2xl font-bold tracking-tight">WINBOX</span>
              </Link>
            </div>

            {/* Menu Desktop */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded-md transition-all"
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
                  className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded-md transition-all flex items-center gap-1"
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
                    className="absolute top-full left-0 mt-1 w-56 bg-black border border-white/10 rounded-md shadow-2xl overflow-hidden z-50"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {liensRessources.map((lien) => (
                      <Link
                        key={lien.href}
                        href={lien.href}
                        onClick={() => setShowRessources(false)}
                        className="block px-4 py-3 text-sm hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                      >
                        {lien.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/WinZone"
                className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded-md transition-all"
              >
                WinZone
              </Link>
              <Link
                href="/WinRank"
                className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded-md transition-all"
              >
                WinRank
              </Link>
              <Link
                href="/Recherche"
                className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded-md transition-all"
              >
                Recherche
              </Link>
              <Link
                href="/Contribuer"
                className="px-4 py-2 ml-2 text-sm font-medium bg-white text-black hover:bg-white/90 rounded-md transition-all"
              >
                Contribuer
              </Link>
            </div>

            {/* Actions utilisateur */}
            <div className="flex items-center gap-3">
              {/* Avatar Desktop */}
              <div className="hidden lg:block relative group">
                <button className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-full transition-all">
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
                <div className="absolute right-0 top-full mt-2 w-48 bg-black border border-white/10 rounded-md shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    href="/Profil"
                    className="block px-4 py-3 text-sm hover:bg-white/10 transition-colors border-b border-white/5"
                  >
                    Profil
                  </Link>
                  <Link
                    href="/Favoris"
                    className="block px-4 py-3 text-sm hover:bg-white/10 transition-colors border-b border-white/5"
                  >
                    Mes Favoris
                  </Link>
                  <Link
                    href="/Admin/Dashboard"
                    className="block px-4 py-3 text-sm hover:bg-white/10 transition-colors border-b border-white/5"
                  >
                    Administration
                  </Link>
                  <button className="w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors text-white/60">
                    Déconnexion
                  </button>
                </div>
              </div>

              {/* Bouton Menu Mobile */}
              <button
                type="button"
                onClick={() => setMenuOuvert(true)}
                aria-label="Ouvrir le menu"
                className="lg:hidden p-2 hover:bg-white/10 rounded-md transition-all"
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
        className={`fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-black border-l border-white/10 transform transition-transform duration-300 ease-out lg:hidden ${
          menuOuvert ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Menu de navigation"
      >
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
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
            className="p-2 hover:bg-white/10 rounded-md transition-all"
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
            <Link
              href="/"
              onClick={fermerMenu}
              className="block px-4 py-3 text-sm font-medium hover:bg-white/10 rounded-md transition-all"
            >
              Accueil
            </Link>

            {/* Ressources académiques */}
            <div className="pt-6 pb-2">
              <p className="px-4 text-xs font-semibold text-white/40 uppercase tracking-wider">
                Ressources académiques
              </p>
            </div>
            {liensRessources.map((lien) => (
              <Link
                key={lien.href}
                href={lien.href}
                onClick={fermerMenu}
                className="block px-4 py-3 text-sm hover:bg-white/10 rounded-md transition-all"
              >
                {lien.label}
              </Link>
            ))}

            {/* Communauté */}
            <div className="pt-6 pb-2">
              <p className="px-4 text-xs font-semibold text-white/40 uppercase tracking-wider">
                Communauté
              </p>
            </div>
            <Link
              href="/WinZone"
              onClick={fermerMenu}
              className="block px-4 py-3 text-sm hover:bg-white/10 rounded-md transition-all"
            >
              WinZone
            </Link>
            <Link
              href="/WinRank"
              onClick={fermerMenu}
              className="block px-4 py-3 text-sm hover:bg-white/10 rounded-md transition-all"
            >
              WinRank
            </Link>
            <Link
              href="/Recherche"
              onClick={fermerMenu}
              className="block px-4 py-3 text-sm hover:bg-white/10 rounded-md transition-all"
            >
              Recherche
            </Link>
            <Link
              href="/Contribuer"
              onClick={fermerMenu}
              className="block px-4 py-3 text-sm bg-white text-black hover:bg-white/90 rounded-md transition-all font-medium"
            >
              Contribuer
            </Link>

            {/* Mon compte */}
            <div className="pt-6 pb-2">
              <p className="px-4 text-xs font-semibold text-white/40 uppercase tracking-wider">
                Mon compte
              </p>
            </div>
            <Link
              href="/Profil"
              onClick={fermerMenu}
              className="block px-4 py-3 text-sm hover:bg-white/10 rounded-md transition-all"
            >
              Mon Profil
            </Link>
            <Link
              href="/Favoris"
              onClick={fermerMenu}
              className="block px-4 py-3 text-sm hover:bg-white/10 rounded-md transition-all"
            >
              Mes Favoris
            </Link>
          </div>

          {/* Admin & Déconnexion */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
            <Link
              href="/Admin/Dashboard"
              onClick={fermerMenu}
              className="block px-4 py-3 text-sm text-center border border-white/20 hover:bg-white/10 rounded-md transition-all"
            >
              Administration
            </Link>
            <button className="w-full px-4 py-3 text-sm text-center text-white/60 hover:bg-white/10 rounded-md transition-all">
              Déconnexion
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default NavBar;
