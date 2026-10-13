"use client";
import { useAuthContext } from "@/contexts/AuthContext";

/**
 * Composant de debug pour l'authentification
 * À SUPPRIMER en production !
 * 
 * Affiche l'état de connexion et permet de se connecter/déconnecter rapidement
 */
export default function AuthDebug() {
  const { utilisateur, estConnecte, connexion, deconnexion, chargement } = useAuthContext();

  // Ne pas afficher en production
  if (process.env.NODE_ENV === "production") return null;

  const handleConnexionRapide = async () => {
    await connexion("test@winbox.com", "password123");
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-2xl border-2 border-white max-w-xs z-[9999]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-black text-sm uppercase tracking-wider">Auth Debug</h3>
        <span className={`px-2 py-1 text-xs font-bold rounded ${estConnecte ? 'bg-green-500' : 'bg-red-500'}`}>
          {chargement ? "..." : estConnecte ? "Connecté" : "Déconnecté"}
        </span>
      </div>

      {estConnecte && utilisateur ? (
        <div className="space-y-2 mb-3">
          <div className="text-xs">
            <p className="text-white/60">Utilisateur :</p>
            <p className="font-medium">{utilisateur.prenom} {utilisateur.nom}</p>
          </div>
          <div className="text-xs">
            <p className="text-white/60">Email :</p>
            <p className="font-medium truncate">{utilisateur.email}</p>
          </div>
          <div className="text-xs">
            <p className="text-white/60">Rôle :</p>
            <p className="font-medium">{utilisateur.role || "etudiant"}</p>
          </div>
        </div>
      ) : (
        <p className="text-xs text-white/80 mb-3">Aucun utilisateur connecté</p>
      )}

      <div className="space-y-2">
        {estConnecte ? (
          <button
            onClick={deconnexion}
            className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded transition-colors"
          >
            Déconnexion
          </button>
        ) : (
          <button
            onClick={handleConnexionRapide}
            className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded transition-colors"
          >
            Connexion test
          </button>
        )}
        
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded transition-colors"
        >
          Clear & Reload
        </button>
      </div>

      <p className="text-[10px] text-white/50 mt-3 text-center">
        Development only
      </p>
    </div>
  );
}
