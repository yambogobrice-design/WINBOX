/**
 * Contrôles de saisie partagés par les formulaires d'authentification.
 * Les mêmes règles existent côté backend (express-validator) : le frontend
 * donne un retour immédiat, le serveur reste l'autorité.
 */

// Format d'email : partie locale, @, domaine avec un point et une extension
const MOTIF_EMAIL = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

export const emailValide = (email: string): boolean => MOTIF_EMAIL.test(email.trim());

export const motDePasseValide = (motDePasse: string): boolean => motDePasse.length >= 8;

export const LONGUEUR_MIN_MOT_DE_PASSE = 8;

/** Retourne un message d'erreur, ou null si l'email est acceptable */
export const messageEmail = (email: string): string | null => {
  const valeur = email.trim();

  if (!valeur) return "L'adresse email est requise";
  if (!emailValide(valeur)) return "Adresse email invalide (exemple : nom@domaine.com)";

  return null;
};
