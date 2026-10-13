"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [chargement, setChargement] = useState(false);
  const [emailEnvoye, setEmailEnvoye] = useState(false);
  const [erreur, setErreur] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    try {
      // TODO: Implémenter la logique d'envoi d'email avec votre backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation
      
      setEmailEnvoye(true);
      console.log("Email de réinitialisation envoyé à:", email);
    } catch {
      setErreur("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black antialiased">
      {/* Grille de fond subtile */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
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
            
            {!emailEnvoye ? (
              <>
                <h1 className="text-4xl font-black mb-3 tracking-tight">Mot de passe oublié ?</h1>
                <p className="text-gray-600 font-light">
                  Entrez votre email pour réinitialiser votre mot de passe
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-4xl font-black mb-3 tracking-tight">Email envoyé !</h1>
                <p className="text-gray-600 font-light">
                  Consultez votre boîte de réception
                </p>
              </>
            )}
          </div>

          {/* Formulaire ou Message de confirmation */}
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
            {!emailEnvoye ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Message d'erreur */}
                {erreur && (
                  <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-3 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{erreur}</span>
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="votre.email@exemple.com"
                    className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 transition-all text-black placeholder:text-gray-400"
                    disabled={chargement}
                  />
                  <p className="text-gray-500 text-xs mt-2 font-light">
                    Nous vous enverrons un lien pour réinitialiser votre mot de passe
                  </p>
                </div>

                {/* Bouton d'envoi */}
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
                      Envoi en cours...
                    </span>
                  ) : (
                    "Envoyer le lien"
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div className="bg-gray-50 border-2 border-gray-200 p-6 rounded">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Nous avons envoyé un lien de réinitialisation à :
                  </p>
                  <p className="font-bold text-black text-lg">{email}</p>
                </div>

                <div className="text-left space-y-3 text-sm text-gray-600">
                  <p className="flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Vérifiez votre boîte de réception et vos spams</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Le lien est valide pendant 1 heure</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Ne partagez ce lien avec personne</span>
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEmailEnvoye(false);
                    setEmail("");
                  }}
                  className="w-full px-6 py-3 border-2 border-black text-black font-bold text-sm hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                >
                  Renvoyer l&apos;email
                </button>
              </div>
            )}
          </div>

          {/* Liens de navigation */}
          <div className="text-center mt-8 space-y-4">
            <p className="text-gray-600">
              Vous vous souvenez de votre mot de passe ?{" "}
              <Link
                href="/Connexion"
                className="font-bold text-black hover:underline underline-offset-4 decoration-2"
              >
                Se connecter
              </Link>
            </p>

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
