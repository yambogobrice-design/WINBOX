import { useCallback, useEffect, useState } from "react";
import { api, ApiError, CLE_JETON, type ChampInvalide } from "@/lib/api";

/**
 * Authentification réelle : les sessions sont créées, vérifiées et mises à jour
 * auprès de l'API WinBox (MySQL). Le jeton et le profil sont conservés dans
 * localStorage pour que la connexion survive au rechargement de la page.
 */

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string | null;
  niveau?: string | null;
  filiere?: string | null;
  specialite?: string | null;
  institution?: string | null;
  bio?: string | null;
  role?: string;
  status?: string;
  points?: number;
  preferences?: Record<string, boolean> | null;
  is_verified?: boolean;
  created_at?: string;
  last_login?: string | null;
}

export interface StatsUtilisateur {
  contributions: number;
  contributions_en_attente: number;
  telechargements: number;
  quiz_completes: number;
  taux_reussite: number | null;
  badges: number;
  favoris: number;
  minutes_etude: number;
  rang: number;
}

export type AuthResult =
  | { success: true; user: User; stats?: StatsUtilisateur | null }
  | { success: false; error: string; champs?: ChampInvalide[]; statut?: number };

const CLE_UTILISATEUR = "userData";

interface ReponseAuth {
  user: User;
  token: string;
  stats?: StatsUtilisateur | null;
}

export function useAuth() {
  const [utilisateur, setUtilisateur] = useState<User | null>(null);
  const [stats, setStats] = useState<StatsUtilisateur | null>(null);
  const [estConnecte, setEstConnecte] = useState(false);
  const [chargement, setChargement] = useState(true);

  // Enregistre la session (mémoire + localStorage)
  const enregistrerSession = useCallback((user: User, token: string, statistiques?: StatsUtilisateur | null) => {
    localStorage.setItem(CLE_JETON, token);
    localStorage.setItem(CLE_UTILISATEUR, JSON.stringify(user));

    setUtilisateur(user);
    setEstConnecte(true);
    if (statistiques !== undefined) setStats(statistiques);
  }, []);

  const viderSession = useCallback(() => {
    localStorage.removeItem(CLE_JETON);
    localStorage.removeItem(CLE_UTILISATEUR);

    setUtilisateur(null);
    setStats(null);
    setEstConnecte(false);
  }, []);

  /**
   * Vérifie la session : affiche le profil en cache immédiatement, puis le
   * confirme auprès du serveur. Un jeton refusé (401) déconnecte ; un serveur
   * injoignable laisse la session locale intacte (mode hors ligne).
   */
  const verifierAuthentification = useCallback(async () => {
    const token = localStorage.getItem(CLE_JETON);
    const cache = localStorage.getItem(CLE_UTILISATEUR);

    if (!token || !cache) {
      viderSession();
      setChargement(false);
      return;
    }

    try {
      setUtilisateur(JSON.parse(cache) as User);
      setEstConnecte(true);
    } catch {
      viderSession();
      setChargement(false);
      return;
    }

    setChargement(false);

    try {
      const donnees = await api<ReponseAuth>("/auth/me", { token });
      enregistrerSession(donnees.user, token, donnees.stats ?? null);
    } catch (error) {
      if (error instanceof ApiError && error.estNonAutorise) {
        viderSession();
      }
      // Sinon (réseau) : on conserve la session locale
    }
  }, [enregistrerSession, viderSession]);

  useEffect(() => {
    // Synchronisation avec localStorage au montage : le setState synchrone est
    // intentionnel pour éviter un mismatch d'hydratation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void verifierAuthentification();
  }, [verifierAuthentification]);

  // Session partagée entre onglets
  useEffect(() => {
    const resynchroniser = () => void verifierAuthentification();

    window.addEventListener("storage", resynchroniser);
    return () => window.removeEventListener("storage", resynchroniser);
  }, [verifierAuthentification]);

  // Construit un échec à partir d'une ApiError
  const echec = (error: unknown, messageParDefaut: string): AuthResult => {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message || messageParDefaut,
        champs: error.champs,
        statut: error.status,
      };
    }

    console.error("Erreur d'authentification:", error);
    return { success: false, error: messageParDefaut };
  };

  /**
   * Connexion : l'email et le mot de passe sont vérifiés dans la base de
   * données par l'API. Un email inconnu renvoie le même message qu'un mot de
   * passe erroné (« Email ou mot de passe incorrect »).
   */
  const connexion = async (email: string, motDePasse: string): Promise<AuthResult> => {
    try {
      const donnees = await api<ReponseAuth>("/auth/login", {
        methode: "POST",
        corps: { email: email.trim().toLowerCase(), motDePasse },
      });

      enregistrerSession(donnees.user, donnees.token, donnees.stats ?? null);

      return { success: true, user: donnees.user, stats: donnees.stats ?? null };
    } catch (error) {
      return echec(error, "Email ou mot de passe incorrect");
    }
  };

  /**
   * Inscription : le compte est enregistré en base. Un email déjà présent
   * remonte une erreur sur le champ « email ».
   */
  const inscription = async (
    prenom: string,
    nom: string,
    email: string,
    motDePasse: string
  ): Promise<AuthResult> => {
    try {
      const donnees = await api<ReponseAuth>("/auth/register", {
        methode: "POST",
        corps: {
          prenom: prenom.trim(),
          nom: nom.trim(),
          email: email.trim().toLowerCase(),
          motDePasse,
        },
      });

      enregistrerSession(donnees.user, donnees.token, null);

      // Complète les statistiques du nouveau compte (obtenues via /auth/me)
      void verifierAuthentification();

      return { success: true, user: donnees.user };
    } catch (error) {
      return echec(error, "Erreur lors de l'inscription");
    }
  };

  /** Déconnexion : session locale supprimée, jeton signalé au serveur */
  const deconnexion = () => {
    const token = localStorage.getItem(CLE_JETON);

    viderSession();

    if (token) {
      void api("/auth/logout", { methode: "POST", token }).catch(() => {
        // Sans conséquence : le jeton est de toute façon oublié côté client
      });
    }
  };

  /** Mise à jour du profil en base (nom, email, niveau, spécialité…) */
  const mettreAJourUtilisateur = async (donnees: Partial<User>): Promise<AuthResult> => {
    const token = localStorage.getItem(CLE_JETON);

    if (!token) {
      return { success: false, error: "Session expirée, veuillez vous reconnecter" };
    }

    try {
      const reponse = await api<{ user: User }>("/auth/profile", {
        methode: "PUT",
        corps: donnees,
        token,
      });

      enregistrerSession(reponse.user, token, stats ?? undefined);

      return { success: true, user: reponse.user };
    } catch (error) {
      return echec(error, "Erreur lors de la mise à jour du profil");
    }
  };

  /** Enregistre les préférences (notifications, profil public, classement) */
  const mettreAJourPreferences = async (
    preferences: Record<string, boolean>
  ): Promise<AuthResult> => {
    const token = localStorage.getItem(CLE_JETON);

    if (!token) {
      return { success: false, error: "Session expirée, veuillez vous reconnecter" };
    }

    try {
      const reponse = await api<{ preferences: Record<string, boolean> }>("/users/me/preferences", {
        methode: "PATCH",
        corps: { preferences },
        token,
      });

      if (utilisateur) {
        enregistrerSession({ ...utilisateur, preferences: reponse.preferences }, token, stats ?? undefined);
      }

      return { success: true, user: { ...(utilisateur as User), preferences: reponse.preferences } };
    } catch (error) {
      return echec(error, "Erreur lors de l'enregistrement des préférences");
    }
  };

  return {
    utilisateur,
    stats,
    estConnecte,
    chargement,
    connexion,
    inscription,
    deconnexion,
    mettreAJourUtilisateur,
    mettreAJourPreferences,
    verifierAuthentification,
  };
}
