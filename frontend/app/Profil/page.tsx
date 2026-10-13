"use client";
import { useEffect, useState } from "react";
import AuthGuard from "@/Components/AuthGuard";
import { api, jetonActuel } from "@/lib/api";
import { useAuthContext } from "@/contexts/AuthContext";

interface ActiviteAPI {
  id: number;
  type: string;
  titre: string;
  points: number;
  created_at: string;
  matiere: string | null;
}

interface BadgeAPI {
  id: number;
  nom: string;
  description: string;
  icon: string | null;
  obtenu: boolean;
}

// Libellés lisibles des types d'activité renvoyés par l'API
const LIBELLES_ACTIVITE: Record<string, string> = {
  inscription: "Inscription",
  quiz: "Quiz complété",
  telechargement: "Téléchargement",
  contribution: "Contribution",
  objectif: "Objectif d'étude",
  defi: "Défi",
  badge: "Badge obtenu",
  session: "Session d'étude",
};

const formaterDate = (valeur?: string | null): string => {
  if (!valeur) return "";

  const date = new Date(valeur);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
};

export default function ProfilPage() {
  return (
    <AuthGuard message="Vous devez être connecté pour accéder à votre espace personnel.">
      <ContenuProfil />
    </AuthGuard>
  );
}

function ContenuProfil() {
  const [ongletActif, setOngletActif] = useState("apercu");

  // Profil et statistiques de la personne connectée (base de données)
  const { utilisateur, stats, mettreAJourUtilisateur, mettreAJourPreferences } = useAuthContext();

  const [messageParametres, setMessageParametres] = useState<{ type: "succes" | "erreur"; texte: string } | null>(null);
  const [enregistrement, setEnregistrement] = useState(false);

  const [activites, setActivites] = useState<ActiviteAPI[]>([]);
  const [badges, setBadges] = useState<BadgeAPI[]>([]);
  const [badgesObtenus, setBadgesObtenus] = useState(0);
  const [badgesTotal, setBadgesTotal] = useState(0);

  // Activité récente et badges : propres à l'utilisateur connecté
  useEffect(() => {
    let annule = false;

    const charger = async () => {
      const jeton = jetonActuel();

      const [reponseActivites, reponseBadges] = await Promise.allSettled([
        api<{ activities: ActiviteAPI[] }>("/users/me/activities?limit=20", { token: jeton }),
        api<{ badges: BadgeAPI[]; progression: { obtenus: number; total: number } }>("/badges/me", {
          token: jeton,
        }),
      ]);

      if (annule) return;

      if (reponseActivites.status === "fulfilled") {
        setActivites(reponseActivites.value.activities ?? []);
      }

      if (reponseBadges.status === "fulfilled") {
        setBadges(reponseBadges.value.badges ?? []);
        setBadgesObtenus(reponseBadges.value.progression?.obtenus ?? 0);
        setBadgesTotal(reponseBadges.value.progression?.total ?? 0);
      }
    };

    void charger();

    return () => {
      annule = true;
    };
  }, []);

  /**
   * Enregistre les informations personnelles et les préférences en base.
   * Les champs sont lus dans le formulaire (FormData) : pas d'état intermédiaire
   * à maintenir quand le profil se charge.
   */
  const enregistrerParametres = async (evenement: React.FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    setMessageParametres(null);

    const donnees = new FormData(evenement.currentTarget);
    const valeur = (champ: string) => String(donnees.get(champ) ?? "").trim();

    setEnregistrement(true);

    const resultatProfil = await mettreAJourUtilisateur({
      prenom: valeur("prenom"),
      nom: valeur("nom"),
      email: valeur("email"),
      niveau: valeur("niveau"),
      specialite: valeur("specialite"),
    });

    if (!resultatProfil.success) {
      setEnregistrement(false);
      setMessageParametres({ type: "erreur", texte: resultatProfil.error });
      return;
    }

    const resultatPreferences = await mettreAJourPreferences({
      notifications_email: donnees.get("notifications_email") === "on",
      profil_public: donnees.get("profil_public") === "on",
      participer_classement: donnees.get("participer_classement") === "on",
    });

    setEnregistrement(false);
    setMessageParametres(
      resultatPreferences.success
        ? { type: "succes", texte: "Modifications enregistrées." }
        : { type: "erreur", texte: resultatPreferences.error }
    );
  };

  const nomComplet = [utilisateur?.prenom, utilisateur?.nom].filter(Boolean).join(" ");
  const initiales = nomComplet
    .split(/\s+/)
    .filter(Boolean)
    .map((mot) => mot[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const points = utilisateur?.points ?? 0;
  const rang = stats?.rang ?? 0;
  const quizCompletes = stats?.quiz_completes ?? 0;
  const tauxReussite = stats?.taux_reussite ?? 0;

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header avec bannière */}
      <div className="border-b border-black/10 bg-gradient-to-br from-black/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-black/10 rounded-full flex items-center justify-center text-4xl font-bold">
              {initiales ? (
                initiales
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-black/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
            </div>

            {/* Infos */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {nomComplet || "Profil utilisateur"}
              </h1>
              {utilisateur?.email && (
                <p className="text-black/70 mb-1">{utilisateur.email}</p>
              )}
              <p className="text-black/60 mb-4">
                {[utilisateur?.niveau, utilisateur?.specialite].filter(Boolean).join(" - ") ||
                  "Niveau et spécialité non renseignés"}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                {utilisateur?.created_at && (
                  <span className="px-3 py-1 bg-black/5 rounded-md">
                    Membre depuis {formaterDate(utilisateur.created_at)}
                  </span>
                )}
                {rang > 0 && (
                  <span className="px-3 py-1 bg-black/5 rounded-md">
                    #{rang} au classement
                  </span>
                )}
              </div>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{points}</p>
                <p className="text-xs text-black/60">Points</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{quizCompletes}</p>
                <p className="text-xs text-black/60">Quiz</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{tauxReussite}%</p>
                <p className="text-xs text-black/60">Réussite</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            {[
              { id: "apercu", label: "Aperçu" },
              { id: "activite", label: "Activité" },
              { id: "badges", label: "Badges" },
              { id: "parametres", label: "Paramètres" },
            ].map((onglet) => (
              <button
                key={onglet.id}
                onClick={() => setOngletActif(onglet.id)}
                className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                  ongletActif === onglet.id
                    ? "border-black text-black"
                    : "border-transparent text-black/60 hover:text-black"
                }`}
              >
                {onglet.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Onglet Aperçu */}
        {ongletActif === "apercu" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Statistiques détaillées */}
            <div className="border border-black/10 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">Statistiques</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-black/10">
                  <span className="text-black/60">Contributions validées</span>
                  <span className="font-semibold">{stats?.contributions ?? 0}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-black/10">
                  <span className="text-black/60">Contributions en attente</span>
                  <span className="font-semibold">{stats?.contributions_en_attente ?? 0}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-black/10">
                  <span className="text-black/60">Téléchargements</span>
                  <span className="font-semibold">{stats?.telechargements ?? 0}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-black/10">
                  <span className="text-black/60">Favoris</span>
                  <span className="font-semibold">{stats?.favoris ?? 0}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-black/10">
                  <span className="text-black/60">Quiz complétés</span>
                  <span className="font-semibold">{quizCompletes}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-black/10">
                  <span className="text-black/60">Taux de réussite</span>
                  <span className="font-semibold">{tauxReussite}%</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-black/10">
                  <span className="text-black/60">Points totaux</span>
                  <span className="font-semibold">{points}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black/60">Classement global</span>
                  <span className="font-semibold">
                    {rang > 0 ? `#${rang}` : "Non classé"}
                  </span>
                </div>
              </div>
            </div>

            {/* Activité récente */}
            <div className="border border-black/10 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">Activité récente</h2>
              {activites.length === 0 && (
                <p className="text-sm text-black/60">Aucune activité pour le moment.</p>
              )}
              <div className="space-y-4">
                {activites.slice(0, 4).map((activite) => (
                  <div key={activite.id} className="flex items-start gap-3 pb-4 border-b border-black/10 last:border-0 last:pb-0">
                    <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activite.titre}</p>
                      <p className="text-xs text-black/60">
                        {LIBELLES_ACTIVITE[activite.type] ?? activite.type}
                        {activite.matiere ? ` • ${activite.matiere}` : ""} •{" "}
                        {formaterDate(activite.created_at)}
                      </p>
                    </div>
                    {activite.points > 0 && (
                      <span className="text-sm font-medium text-green-600">+{activite.points}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Onglet Activité */}
        {ongletActif === "activite" && (
          <div className="space-y-4">
            {activites.length === 0 && (
              <p className="text-sm text-black/60">Aucune activité pour le moment.</p>
            )}
            {activites.map((activite) => (
              <div
                key={activite.id}
                className="border border-black/10 rounded-lg p-6 hover:border-black/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">{activite.titre}</p>
                      <p className="text-sm text-black/60">
                        {LIBELLES_ACTIVITE[activite.type] ?? activite.type}
                        {activite.matiere ? ` • ${activite.matiere}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activite.points > 0 && (
                      <p className="font-semibold text-green-600 mb-1">+{activite.points}</p>
                    )}
                    <p className="text-xs text-black/60">{formaterDate(activite.created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Onglet Badges */}
        {ongletActif === "badges" && (
          <div>
            <p className="text-sm text-black/60 mb-6">
              {badgesObtenus} badge{badgesObtenus > 1 ? "s" : ""} obtenu
              {badgesObtenus > 1 ? "s" : ""} sur {badgesTotal}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.length === 0 && (
                <p className="text-sm text-black/60">Aucun badge pour le moment.</p>
              )}
              {badges.map((badge) => (
              <div
                key={badge.id}
                className={`border rounded-lg p-6 text-center ${
                  badge.obtenu
                    ? "border-black/10 bg-white"
                    : "border-black/10 bg-black/5 opacity-50"
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  badge.obtenu ? "bg-black text-white" : "bg-black/20 text-black/40"
                }`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">{badge.nom}</h3>
                <p className="text-sm text-black/60">{badge.description}</p>
                {badge.obtenu && (
                  <p className="text-xs text-green-600 mt-3 font-medium">✓ Obtenu</p>
                )}
              </div>
            ))}
            </div>
          </div>
        )}

        {/* Onglet Paramètres */}
        {ongletActif === "parametres" && (
          <form className="max-w-2xl space-y-6" onSubmit={enregistrerParametres}>
            <div className="border border-black/10 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">Informations personnelles</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="prenom" className="block text-sm font-medium mb-2">Prénom</label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      defaultValue={utilisateur?.prenom ?? ""}
                      className="w-full px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="nom" className="block text-sm font-medium mb-2">Nom</label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      defaultValue={utilisateur?.nom ?? ""}
                      className="w-full px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={utilisateur?.email ?? ""}
                    className="w-full px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="niveau" className="block text-sm font-medium mb-2">Niveau</label>
                    <select 
                      id="niveau"
                      name="niveau"
                      defaultValue={utilisateur?.niveau ?? ""}
                      className="w-full px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
                    >
                      <option value="">Non renseigné</option>
                      <option>BACHELOR ELECTRO.MAINTENANCE ENGINS LOURDS</option>
                      <option>BACHELOR TECHNO EMIH-EREE S1</option>
                      <option>BACHELOR TECHNO EMIH-EREE S2</option>
                      <option>BACHELOR TECHNO EMIH-EREE S3</option>
                      <option>BACHELOR TECHNO EMIH-EREE S4</option>
                      <option>BACHELOR TECHNO EMIH-EREE S5</option>
                      <option>BACHELOR TECHNO EMIH-EREE S6</option>
                      <option>BACHELOR TECHNO TOPO SIG S6 D</option>
                      <option>BACHELOR CENTRALE-2iE AFRICAN ANNEE 1</option>
                      <option>BACHELOR CENTRALE-2iE AFRICAN ANNEE 2</option>
                      <option>BACHELOR L1 - S1</option>
                      <option>BACHELOR L1 - S2</option>
                      <option>BACHELOR L2 - S3</option>
                      <option>BACHELOR L2 - S4</option>
                      <option>BACHELOR L3D - S5 D</option>
                      <option>BACHELOR L3D - S6 D</option>
                      <option>BACHELOR L3S - S5 S</option>
                      <option>COURS PREPA 1</option>
                      <option>COURS PREPA 2</option>
                      <option>CYCLE ING IIA S5D</option>
                      <option>CYCLE ING IIA S6</option>
                      <option>CYCLE ING IIA S7</option>
                      <option>CYCLE ING IIA S8</option>
                      <option>CYCLE ING IIA S9</option>
                      <option>MASTER SP ANC</option>
                      <option>MASTER SP WASH</option>
                      <option>MASTER 1 S7</option>
                      <option>MASTER 1 S8</option>
                      <option>MASTER 2 S9 GC - BTP</option>
                      <option>MASTER 2 S9 GEAAH</option>
                      <option>MASTER 2 S9 GEE</option>
                      <option>PROGRAMME DE MISE A NIVEAU</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="specialite" className="block text-sm font-medium mb-2">Spécialité</label>
                    <input
                      type="text"
                      id="specialite"
                      name="specialite"
                      defaultValue={utilisateur?.specialite ?? ""}
                      className="w-full px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-black/10 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">Préférences</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">Recevoir les notifications par email</span>
                  <input
                    type="checkbox"
                    name="notifications_email"
                    defaultChecked={utilisateur?.preferences?.notifications_email ?? false}
                    className="w-5 h-5"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">Afficher mon profil publiquement</span>
                  <input
                    type="checkbox"
                    name="profil_public"
                    defaultChecked={utilisateur?.preferences?.profil_public ?? false}
                    className="w-5 h-5"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">Participer au classement</span>
                  <input
                    type="checkbox"
                    name="participer_classement"
                    defaultChecked={utilisateur?.preferences?.participer_classement ?? false}
                    className="w-5 h-5"
                  />
                </label>
              </div>
            </div>

            {messageParametres && (
              <p
                className={`text-sm font-medium ${
                  messageParametres.type === "succes" ? "text-green-700" : "text-red-600"
                }`}
              >
                {messageParametres.texte}
              </p>
            )}

            <button
              type="submit"
              disabled={enregistrement}
              className="w-full px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-black/90 transition-all disabled:opacity-60"
            >
              {enregistrement ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
