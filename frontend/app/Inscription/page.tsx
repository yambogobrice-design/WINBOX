"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function InscriptionPage() {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    motDePasse: "",
    confirmationMotDePasse: "",
  });
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);
  const [afficherConfirmation, setAfficherConfirmation] = useState(false);
  const [accepterConditions, setAccepterConditions] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});

  const validerFormulaire = () => {
    const nouvellesErreurs: Record<string, string> = {};

    if (formData.prenom.length < 2) {
      nouvellesErreurs.prenom = "Le prénom doit contenir au moins 2 caractères";
    }
    if (formData.nom.length < 2) {
      nouvellesErreurs.nom = "Le nom doit contenir au moins 2 caractères";
    }
    if (!formData.email.includes("@")) {
      nouvellesErreurs.email = "Adresse email invalide";
    }
    if (formData.motDePasse.length < 8) {
      nouvellesErreurs.motDePasse = "Le mot de passe doit contenir au moins 8 caractères";
    }
    if (formData.motDePasse !== formData.confirmationMotDePasse) {
      nouvellesErreurs.confirmationMotDePasse = "Les mots de passe ne correspondent pas";
    }
    if (!accepterConditions) {
      nouvellesErreurs.conditions = "Vous devez accepter les conditions d'utilisation";
    }

    setErreurs(nouvellesErreurs);
    return Object.keys(nouvellesErreurs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validerFormulaire()) return;

    setChargement(true);

    try {
      // TODO: Implémenter la logique d'inscription avec votre backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation
      
      // Redirection après inscription réussie
      // router.push('/Connexion');
      
      console.log("Inscription:", formData);
    } catch {
      setErreurs({ general: "Une erreur est survenue lors de l'inscription" });
    } finally {
      setChargement(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ modifié
    if (erreurs[name]) {
      setErreurs(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-white text-black antialiased">
      {/* Grille de fond subtile */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Logo et Titre */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center gap-3 mb-6 hover:opacity-80 transition-opacity">
              <Image
                src="/Logo_winbox.jpg"
                alt="WinBox Logo"
                width={60}
                height={60}
                className="rounded-md"
              />
              <span className="text-3xl font-black tracking-tight">WINBOX</span>
            </Link>
            <h1 className="text-4xl font-black mb-3 tracking-tight">Créer un compte</h1>
            <p className="text-gray-600 font-light">
              Rejoignez la communauté et accédez à toutes les ressources
            </p>
          </div>

          {/* Formulaire */}
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Message d'erreur général */}
              {erreurs.general && (
                <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-3 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{erreurs.general}</span>
                  </div>
                </div>
              )}

              {/* Prénom et Nom */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="prenom" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                    placeholder="Jean"
                    className={`w-full px-4 py-3 border-2 ${erreurs.prenom ? 'border-red-500' : 'border-black'} focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 transition-all text-black placeholder:text-gray-400`}
                    disabled={chargement}
                  />
                  {erreurs.prenom && (
                    <p className="text-red-600 text-xs mt-1 font-medium">{erreurs.prenom}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="nom" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    placeholder="Dupont"
                    className={`w-full px-4 py-3 border-2 ${erreurs.nom ? 'border-red-500' : 'border-black'} focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 transition-all text-black placeholder:text-gray-400`}
                    disabled={chargement}
                  />
                  {erreurs.nom && (
                    <p className="text-red-600 text-xs mt-1 font-medium">{erreurs.nom}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                  Adresse email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="jean.dupont@exemple.com"
                  className={`w-full px-4 py-3 border-2 ${erreurs.email ? 'border-red-500' : 'border-black'} focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 transition-all text-black placeholder:text-gray-400`}
                  disabled={chargement}
                />
                {erreurs.email && (
                  <p className="text-red-600 text-xs mt-1 font-medium">{erreurs.email}</p>
                )}
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="motDePasse" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={afficherMotDePasse ? "text" : "password"}
                    id="motDePasse"
                    name="motDePasse"
                    value={formData.motDePasse}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border-2 ${erreurs.motDePasse ? 'border-red-500' : 'border-black'} focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 transition-all text-black placeholder:text-gray-400 pr-12`}
                    disabled={chargement}
                  />
                  <button
                    type="button"
                    onClick={() => setAfficherMotDePasse(!afficherMotDePasse)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                    tabIndex={-1}
                  >
                    {afficherMotDePasse ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {erreurs.motDePasse && (
                  <p className="text-red-600 text-xs mt-1 font-medium">{erreurs.motDePasse}</p>
                )}
                <p className="text-gray-500 text-xs mt-1 font-light">
                  Minimum 8 caractères
                </p>
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label htmlFor="confirmationMotDePasse" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type={afficherConfirmation ? "text" : "password"}
                    id="confirmationMotDePasse"
                    name="confirmationMotDePasse"
                    value={formData.confirmationMotDePasse}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border-2 ${erreurs.confirmationMotDePasse ? 'border-red-500' : 'border-black'} focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 transition-all text-black placeholder:text-gray-400 pr-12`}
                    disabled={chargement}
                  />
                  <button
                    type="button"
                    onClick={() => setAfficherConfirmation(!afficherConfirmation)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                    tabIndex={-1}
                  >
                    {afficherConfirmation ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {erreurs.confirmationMotDePasse && (
                  <p className="text-red-600 text-xs mt-1 font-medium">{erreurs.confirmationMotDePasse}</p>
                )}
              </div>

              {/* Conditions d'utilisation */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={accepterConditions}
                    onChange={(e) => {
                      setAccepterConditions(e.target.checked);
                      if (erreurs.conditions) {
                        setErreurs(prev => ({ ...prev, conditions: "" }));
                      }
                    }}
                    className={`w-5 h-5 mt-0.5 border-2 ${erreurs.conditions ? 'border-red-500' : 'border-black'} accent-black cursor-pointer flex-shrink-0`}
                    disabled={chargement}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-black transition-colors">
                    J&apos;accepte les{" "}
                    <Link href="/Conditions" className="font-bold text-black underline underline-offset-2">
                      conditions d&apos;utilisation
                    </Link>
                    {" "}et la{" "}
                    <Link href="/Confidentialite" className="font-bold text-black underline underline-offset-2">
                      politique de confidentialité
                    </Link>
                  </span>
                </label>
                {erreurs.conditions && (
                  <p className="text-red-600 text-xs mt-1 font-medium ml-8">{erreurs.conditions}</p>
                )}
              </div>

              {/* Bouton d'inscription */}
              <button
                type="submit"
                disabled={chargement}
                className="w-full px-6 py-4 bg-black text-white font-black text-sm hover:bg-gray-800 transition-all uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
              >
                {chargement ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Inscription en cours...
                  </span>
                ) : (
                  "Créer mon compte"
                )}
              </button>

              {/* Séparateur */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-black/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-bold uppercase tracking-wider">
                    Ou s&apos;inscrire avec
                  </span>
                </div>
              </div>

              {/* Inscription sociale */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="px-4 py-3 border-2 border-black text-black font-bold text-sm hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  disabled={chargement}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="px-4 py-3 border-2 border-black text-black font-bold text-sm hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  disabled={chargement}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div>
            </form>
          </div>

          {/* Connexion */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Vous avez déjà un compte ?{" "}
              <Link
                href="/Connexion"
                className="font-bold text-black hover:underline underline-offset-4 decoration-2"
              >
                Se connecter
              </Link>
            </p>
          </div>

          {/* Retour à l'accueil */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors font-medium"
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
  );
}
