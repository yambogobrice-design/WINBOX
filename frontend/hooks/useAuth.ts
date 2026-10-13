import { useCallback, useEffect, useState } from "react";

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role?: string;
}

export type AuthResult =
  | { success: true; user: User }
  | { success: false; error: string };

export function useAuth() {
  const [utilisateur, setUtilisateur] = useState<User | null>(null);
  const [estConnecte, setEstConnecte] = useState(false);
  const [chargement, setChargement] = useState(true);

  const verifierAuthentification = useCallback(() => {
    try {
      // TODO: Remplacer par votre vraie logique d'authentification
      const token = localStorage.getItem("authToken");
      const userDataStr = localStorage.getItem("userData");

      if (token && userDataStr) {
        const userData = JSON.parse(userDataStr);
        setUtilisateur(userData);
        setEstConnecte(true);
      } else {
        setUtilisateur(null);
        setEstConnecte(false);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'authentification:", error);
      setUtilisateur(null);
      setEstConnecte(false);
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    // Synchronisation avec un système externe (localStorage) au montage : le
    // setState synchrone est intentionnel pour éviter un mismatch d'hydratation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    verifierAuthentification();
  }, [verifierAuthentification]);

  // La session reste valable d'un onglet à l'autre : on se resynchronise
  // lorsqu'une autre fenêtre se connecte ou se déconnecte.
  useEffect(() => {
    window.addEventListener("storage", verifierAuthentification);
    return () => window.removeEventListener("storage", verifierAuthentification);
  }, [verifierAuthentification]);

  const connexion = async (email: string, motDePasse: string): Promise<AuthResult> => {
    // Le mot de passe sera transmis à l'API d'authentification (voir TODO ci-dessous).
    void motDePasse;
    try {
      // TODO: Remplacer par votre appel API réel
      // const response = await fetch('/api/auth/login', { ... });
      
      // Simulation pour l'exemple
      const mockUser: User = {
        id: "1",
        nom: "Dupont",
        prenom: "Jean",
        email: email,
        role: "etudiant",
      };
      const mockToken = "mock-jwt-token-" + Date.now();

      // Sauvegarder dans localStorage
      localStorage.setItem("authToken", mockToken);
      localStorage.setItem("userData", JSON.stringify(mockUser));

      setUtilisateur(mockUser);
      setEstConnecte(true);

      return { success: true, user: mockUser };
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      return { success: false, error: "Identifiants incorrects" };
    }
  };

  const inscription = async (
    prenom: string,
    nom: string,
    email: string,
    motDePasse: string
  ): Promise<AuthResult> => {
    // Le mot de passe sera transmis à l'API d'authentification (voir TODO ci-dessous).
    void motDePasse;
    try {
      // TODO: Remplacer par votre appel API réel
      // const response = await fetch('/api/auth/register', { ... });

      // Simulation pour l'exemple
      const mockUser: User = {
        id: Date.now().toString(),
        nom,
        prenom,
        email,
        role: "etudiant",
      };
      const mockToken = "mock-jwt-token-" + Date.now();

      // Sauvegarder dans localStorage
      localStorage.setItem("authToken", mockToken);
      localStorage.setItem("userData", JSON.stringify(mockUser));

      setUtilisateur(mockUser);
      setEstConnecte(true);

      return { success: true, user: mockUser };
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      return { success: false, error: "Erreur lors de l'inscription" };
    }
  };

  const deconnexion = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUtilisateur(null);
    setEstConnecte(false);
  };

  const mettreAJourUtilisateur = (donnees: Partial<User>) => {
    if (utilisateur) {
      const utilisateurMisAJour = { ...utilisateur, ...donnees };
      setUtilisateur(utilisateurMisAJour);
      localStorage.setItem("userData", JSON.stringify(utilisateurMisAJour));
    }
  };

  return {
    utilisateur,
    estConnecte,
    chargement,
    connexion,
    inscription,
    deconnexion,
    mettreAJourUtilisateur,
    verifierAuthentification,
  };
}
