/**
 * Client HTTP de l'API WinBox.
 *
 * URL de base configurable via NEXT_PUBLIC_API_URL (par défaut le backend local).
 * Toutes les réponses de l'API suivent l'enveloppe { success, message, data } :
 * `api()` renvoie directement `data` et transforme les erreurs en ApiError.
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

/** Clé localStorage du jeton JWT (source unique, partagée avec useAuth) */
export const CLE_JETON = "authToken";

/** Jeton de la session en cours, ou null (y compris côté serveur) */
export const jetonActuel = (): string | null => {
  return typeof window === "undefined" ? null : localStorage.getItem(CLE_JETON);
};

export interface ChampInvalide {
  field: string;
  message: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly champs: ChampInvalide[];

  constructor(message: string, status = 0, champs: ChampInvalide[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.champs = champs;
  }

  /** Le serveur n'a pas répondu (backend arrêté, réseau coupé…) */
  get estReseau(): boolean {
    return this.status === 0;
  }

  get estNonAutorise(): boolean {
    return this.status === 401;
  }

  get estConflit(): boolean {
    return this.status === 409;
  }

  /** Message d'erreur associé à un champ précis, s'il y en a un */
  messageChamp(champ: string): string | undefined {
    return this.champs.find((erreur) => erreur.field === champ)?.message;
  }
}

interface OptionsRequete {
  methode?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  corps?: unknown;
  formulaire?: FormData;
  token?: string | null;
  cache?: RequestCache;
}

export async function api<T>(chemin: string, options: OptionsRequete = {}): Promise<T> {
  const { methode = "GET", corps, formulaire, token, cache = "no-store" } = options;

  const entetes: Record<string, string> = {};
  if (token) entetes.Authorization = `Bearer ${token}`;
  if (corps !== undefined && !formulaire) entetes["Content-Type"] = "application/json";

  let reponse: Response;

  try {
    reponse = await fetch(`${API_URL}${chemin}`, {
      method: methode,
      headers: entetes,
      body: formulaire ?? (corps !== undefined ? JSON.stringify(corps) : undefined),
      cache,
    });
  } catch {
    throw new ApiError(
      "Impossible de joindre le serveur. Vérifiez que le backend est démarré (npm run dev dans Backend/).",
      0
    );
  }

  const charge = await reponse.json().catch(() => null);

  if (!reponse.ok || charge?.success === false) {
    throw new ApiError(
      charge?.message || `Erreur ${reponse.status}`,
      reponse.status,
      Array.isArray(charge?.errors) ? charge.errors : []
    );
  }

  return (charge?.data ?? charge) as T;
}

export default api;
