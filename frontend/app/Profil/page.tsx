"use client";
import { useState } from "react";

export default function ProfilPage() {
  const [ongletActif, setOngletActif] = useState("apercu");

  // Données utilisateur
  const utilisateur = {
    nom: "Jean Dupont",
    email: "jean.dupont@email.com",
    niveau: "Licence 2",
    specialite: "Informatique",
    dateInscription: "Janvier 2024",
    points: 5420,
    rang: 42,
    quizCompletes: 42,
    tauxReussite: 82,
  };

  const activitesRecentes = [
    { id: 1, type: "Quiz complété", titre: "Algorithmes de tri", date: "Il y a 2 heures", points: "+50" },
    { id: 2, type: "Téléchargement", titre: "Cours - Analyse Mathématique", date: "Il y a 5 heures", points: null },
    { id: 3, type: "Contribution", titre: "Notes de cours Python", date: "Hier", points: "+100" },
    { id: 4, type: "Quiz complété", titre: "Mécanique Quantique", date: "Il y a 2 jours", points: "+75" },
  ];

  const badges = [
    { id: 1, nom: "Premier pas", description: "Premier quiz complété", obtenu: true },
    { id: 2, nom: "Contributeur", description: "Première contribution", obtenu: true },
    { id: 3, nom: "Expert", description: "50 quiz complétés", obtenu: false },
    { id: 4, nom: "Perfectionniste", description: "95% de réussite", obtenu: true },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header avec bannière */}
      <div className="border-b border-black/10 bg-gradient-to-br from-black/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-black/10 rounded-full flex items-center justify-center text-4xl font-bold">
              JD
            </div>

            {/* Infos */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{utilisateur.nom}</h1>
              <p className="text-black/60 mb-4">
                {utilisateur.niveau} - {utilisateur.specialite}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="px-3 py-1 bg-black/5 rounded-md">
                  Membre depuis {utilisateur.dateInscription}
                </span>
                <span className="px-3 py-1 bg-black/5 rounded-md">
                  #{utilisateur.rang} au classement
                </span>
              </div>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{utilisateur.points}</p>
                <p className="text-xs text-black/60">Points</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{utilisateur.quizCompletes}</p>
                <p className="text-xs text-black/60">Quiz</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{utilisateur.tauxReussite}%</p>
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
                  <span className="text-black/60">Quiz complétés</span>
                  <span className="font-semibold">{utilisateur.quizCompletes}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-black/10">
                  <span className="text-black/60">Taux de réussite</span>
                  <span className="font-semibold">{utilisateur.tauxReussite}%</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-black/10">
                  <span className="text-black/60">Points totaux</span>
                  <span className="font-semibold">{utilisateur.points}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black/60">Classement global</span>
                  <span className="font-semibold">#{utilisateur.rang}</span>
                </div>
              </div>
            </div>

            {/* Activité récente */}
            <div className="border border-black/10 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">Activité récente</h2>
              <div className="space-y-4">
                {activitesRecentes.slice(0, 4).map((activite) => (
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
                      <p className="text-xs text-black/60">{activite.type} • {activite.date}</p>
                    </div>
                    {activite.points && (
                      <span className="text-sm font-medium text-green-600">{activite.points}</span>
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
            {activitesRecentes.map((activite) => (
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
                      <p className="text-sm text-black/60">{activite.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activite.points && (
                      <p className="font-semibold text-green-600 mb-1">{activite.points}</p>
                    )}
                    <p className="text-xs text-black/60">{activite.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Onglet Badges */}
        {ongletActif === "badges" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        )}

        {/* Onglet Paramètres */}
        {ongletActif === "parametres" && (
          <div className="max-w-2xl space-y-6">
            <div className="border border-black/10 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">Informations personnelles</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom complet</label>
                  <input
                    type="text"
                    defaultValue={utilisateur.nom}
                    className="w-full px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={utilisateur.email}
                    className="w-full px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Niveau</label>
                    <select className="w-full px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors">
                      <option>Licence 1</option>
                      <option selected>Licence 2</option>
                      <option>Licence 3</option>
                      <option>Master 1</option>
                      <option>Master 2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Spécialité</label>
                    <input
                      type="text"
                      defaultValue={utilisateur.specialite}
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
                  <input type="checkbox" className="w-5 h-5" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">Afficher mon profil publiquement</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">Participer au classement</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
              </div>
            </div>

            <button className="w-full px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-black/90 transition-all">
              Enregistrer les modifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
