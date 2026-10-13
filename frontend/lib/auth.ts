/**
 * Helpers d'authentification côté client.
 *
 * La session est persistée dans `localStorage` avec les mêmes clés que le hook
 * `useAuth` (`authToken` pour le jeton, `userData` pour le profil sérialisé).
 * Ces fonctions sont utilisables hors composant React (gardes, handlers, etc.).
 */
import type { User } from "@/hooks/useAuth";

export const TOKEN_STORAGE_KEY = "authToken";
export const USER_STORAGE_KEY = "userData";

/** Retourne le jeton stocké, ou null si absent (ou hors navigateur). */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

/** Retourne le profil stocké, ou null si absent / illisible. */
export function getUser(): User | null {
  if (typeof window === "undefined") return null;

  const userData = localStorage.getItem(USER_STORAGE_KEY);
  if (!userData) return null;

  try {
    return JSON.parse(userData) as User;
  } catch {
    // Données corrompues : on nettoie pour éviter de boucler sur une session invalide.
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

/** Indique si une session est présente (jeton + profil). */
export function isAuthenticated(): boolean {
  return Boolean(getToken() && getUser());
}

/** Enregistre la session après connexion / inscription. */
export function saveAuth(token: string, user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

/** Supprime la session (déconnexion). */
export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}
