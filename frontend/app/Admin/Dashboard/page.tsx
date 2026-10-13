"use client";
import { useState } from "react";

export default function AdminDashboard() {
  const [periode, setPeriode] = useState<"7j" | "30j" | "90j">("30j");

  // Statistiques principales
  const stats = {
    utilisateurs: {
      total: 2547,
      nouveaux: 127,
      actifs: 1834,
      evolution: "+12%",
    },
    ressources: {
      total: 3892,
      enAttente: 45,
      validees: 3847,
      evolution: "+8%",
    },
    telechargements: {
      total: 45678,
      aujourdhui: 342,
      evolution: "+23%",
    },
    contributions: {
      total: 1523,
      enAttente: 28,
      evolution: "+15%",
    },
  };

  // Activités récentes
  const activitesRecentes = [
    {
      id: 1,
      type: "nouvelle_ressource",
      user: "Ahmed Benali",
      action: "a ajouté un livre",
      ressource: "Analyse Mathématique - Tome 2",
      temps: "Il y a 5 min",
    },
    {
      id: 2,
      type: "nouveau_utilisateur",
      user: "Sarah Martin",
      action: "s'est inscrit",
      temps: "Il y a 12 min",
    },
    {
      id: 3,
      type: "validation",
      user: "Admin",
      action: "a validé",
      ressource: "Sujet Physique 2024",
      temps: "Il y a 23 min",
    },
    {
      id: 4,
      type: "contribution",
      user: "Karim El Haddad",
      action: "a soumis une correction",
      ressource: "Algèbre Licence 2",
      temps: "Il y a 1h",
    },
    {
      id: 5,
      type: "signalement",
      user: "User_4567",
      action: "a signalé un problème",
      ressource: "Document corrompu",
      temps: "Il y a 2h",
    },
  ];

  // Ressources populaires
  const ressourcesPopulaires = [
    { id: 1, titre: "Analyse Mathématique", type: "Livre", downloads: 1234, note: 4.8 },
    { id: 2, titre: "Physique Quantique", type: "Cours", downloads: 987, note: 4.7 },
    { id: 3, titre: "Algorithmes Avancés", type: "TD", downloads: 856, note: 4.9 },
    { id: 4, titre: "Examen Final 2024", type: "Sujet", downloads: 745, note: 4.6 },
    { id: 5, titre: "Chimie Organique", type: "Livre", downloads: 623, note: 4.5 },
  ];

  // Actions en attente
  const actionsEnAttente = [
    { id: 1, type: "validation", item: "Livre: Thermodynamique Avancée", user: "Jean Dupont", date: "2024-01-15" },
    { id: 2, type: "signalement", item: "Sujet: Erreur dans le corrigé", user: "Marie Laurent", date: "2024-01-15" },
    { id: 3, type: "validation", item: "Correction: Mécanique des fluides", user: "Pierre Martin", date: "2024-01-14" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Vue d&apos;ensemble de la plateforme WinBox</p>
      </div>

      {/* Filtres de période */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setPeriode("7j")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            periode === "7j"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          7 derniers jours
        </button>
        <button
          onClick={() => setPeriode("30j")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            periode === "30j"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          30 derniers jours
        </button>
        <button
          onClick={() => setPeriode("90j")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            periode === "90j"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          90 derniers jours
        </button>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-green-600">{stats.utilisateurs.evolution}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.utilisateurs.total}</h3>
          <p className="text-sm text-gray-600 mb-2">Utilisateurs inscrits</p>
          <p className="text-xs text-gray-500">
            {stats.utilisateurs.nouveaux} nouveaux • {stats.utilisateurs.actifs} actifs
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-green-600">{stats.ressources.evolution}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.ressources.total}</h3>
          <p className="text-sm text-gray-600 mb-2">Ressources totales</p>
          <p className="text-xs text-gray-500">
            {stats.ressources.enAttente} en attente • {stats.ressources.validees} validées
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <span className="text-sm font-medium text-green-600">{stats.telechargements.evolution}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.telechargements.total}</h3>
          <p className="text-sm text-gray-600 mb-2">Téléchargements</p>
          <p className="text-xs text-gray-500">{stats.telechargements.aujourdhui} aujourd&apos;hui</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-green-600">{stats.contributions.evolution}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.contributions.total}</h3>
          <p className="text-sm text-gray-600 mb-2">Contributions</p>
          <p className="text-xs text-gray-500">{stats.contributions.enAttente} en attente de validation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Actions en attente */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Actions en attente</h2>
              <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                {actionsEnAttente.length}
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {actionsEnAttente.map((action) => (
              <div key={action.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          action.type === "validation"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {action.type === "validation" ? "Validation" : "Signalement"}
                      </span>
                      <span className="text-xs text-gray-500">{action.date}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">{action.item}</p>
                    <p className="text-xs text-gray-500">Par {action.user}</p>
                  </div>
                  <button className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors">
                    Traiter
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              Voir toutes les actions →
            </button>
          </div>
        </div>

        {/* Activités récentes */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Activités récentes</h2>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {activitesRecentes.map((activite) => (
              <div key={activite.id} className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-gray-600">
                      {activite.user.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activite.user}</span>{" "}
                      <span className="text-gray-600">{activite.action}</span>
                      {activite.ressource && (
                        <>
                          {" "}
                          <span className="font-medium">{activite.ressource}</span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activite.temps}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ressources populaires */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Ressources les plus téléchargées</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléchargements
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ressourcesPopulaires.map((ressource) => (
                <tr key={ressource.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">{ressource.titre}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                      {ressource.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {ressource.downloads}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="text-sm text-gray-900">{ressource.note}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-gray-600 hover:text-gray-900">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
