"use client";
import { createContext, useContext, ReactNode } from "react";
import { useAuth, type AuthResult, type StatsUtilisateur, type User } from "@/hooks/useAuth";

export type { AuthResult, StatsUtilisateur, User };

interface AuthContextType {
  utilisateur: User | null;
  stats: StatsUtilisateur | null;
  estConnecte: boolean;
  chargement: boolean;
  connexion: (email: string, motDePasse: string) => Promise<AuthResult>;
  inscription: (
    prenom: string,
    nom: string,
    email: string,
    motDePasse: string
  ) => Promise<AuthResult>;
  deconnexion: () => void;
  mettreAJourUtilisateur: (donnees: Partial<User>) => Promise<AuthResult>;
  mettreAJourPreferences: (preferences: Record<string, boolean>) => Promise<AuthResult>;
  verifierAuthentification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext doit être utilisé dans un AuthProvider");
  }
  return context;
}
