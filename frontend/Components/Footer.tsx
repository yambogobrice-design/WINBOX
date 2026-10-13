import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-white text-black border-t border-black/10">
      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* À propos / Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/Logo_winbox.jpg"
                alt="WinBox Logo"
                width={40}
                height={40}
                className="rounded-md"
              />
              <h6 className="font-bold text-xl tracking-tight">WINBOX</h6>
            </div>
            <p className="text-sm text-black/60 leading-relaxed">
              Plateforme académique dédiée à la réussite des étudiants. Accédez à des ressources de qualité pour mieux préparer vos examens.
            </p>
            <div className="flex gap-3 pt-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 hover:bg-black/5 rounded-md transition-all border border-black/10"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
             
          </div>

          {/* Ressources */}
          <div>
            <h6 className="font-semibold text-sm uppercase tracking-wider mb-4 text-black/50">Ressources</h6>
            <ul className="space-y-3">
              <li>
                <Link prefetch={true} href="/Livres" className="text-sm text-black/70 hover:text-black transition-colors">
                  Livres
                </Link>
              </li>
              <li>
                <Link prefetch={true} href="/Cours&Supports" className="text-sm text-black/70 hover:text-black transition-colors">
                  Cours & Supports
                </Link>
              </li>
              <li>
                <Link prefetch={true} href="/Sujets" className="text-sm text-black/70 hover:text-black transition-colors">
                  Sujets d&apos;examens
                </Link>
              </li>
              <li>
                <Link prefetch={true} href="/Corrections" className="text-sm text-black/70 hover:text-black transition-colors">
                  Corrections
                </Link>
              </li>
            </ul>
          </div>

          {/* Communauté */}
          <div>
            <h6 className="font-semibold text-sm uppercase tracking-wider mb-4 text-black/50">Communauté</h6>
            <ul className="space-y-3">
              <li>
                <Link prefetch={true} href="/WinZone" className="text-sm text-black/70 hover:text-black transition-colors">
                  WinZone
                </Link>
              </li>
              <li>
                <Link prefetch={true} href="/WinRank" className="text-sm text-black/70 hover:text-black transition-colors">
                  WinRank
                </Link>
              </li>
              <li>
                <Link prefetch={true} href="/Recherche" className="text-sm text-black/70 hover:text-black transition-colors">
                  Recherche
                </Link>
              </li>
              <li>
                <Link prefetch={true} href="/Contribuer" className="text-sm text-black/70 hover:text-black transition-colors">
                  Contribuer
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h6 className="font-semibold text-sm uppercase tracking-wider mb-4 text-black/50">Restez informé</h6>
            <p className="text-sm text-black/60 mb-4">
              Recevez les dernières actualités et nouveautés de WinBox.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="votre@email.com"
                className="w-full px-4 py-2 bg-gray-50 border-2 border-black/10 rounded-md text-sm focus:outline-none focus:border-black transition-colors placeholder:text-black/40"
              />
              <button className="w-full px-4 py-2 bg-black text-white font-bold text-sm rounded-md hover:bg-black/90 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[-2px] hover:translate-y-[-2px]">
                S&apos;abonner
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Barre de copyright */}
      <div className="border-t-2 border-black/10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-black/60">
            <p className="font-medium">&copy; {new Date().getFullYear()} WinBox. Tous droits réservés.</p>
            <div className="flex gap-6">
              <Link prefetch={true} href="/mentions-legales" className="hover:text-black transition-colors">
                Mentions légales
              </Link>
              <Link prefetch={true} href="/confidentialite" className="hover:text-black transition-colors">
                Confidentialité
              </Link>
              <Link prefetch={true} href="/conditions" className="hover:text-black transition-colors">
                Conditions d&apos;utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

