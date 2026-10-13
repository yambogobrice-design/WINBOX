"use client";
import { useState } from "react";

interface Ressource {
  id: number;
  titre: string;
  type: "livre" | "sujet" | "correction" | "cours";
  matiere: string;
  filiere: string;
  niveau: string;
  auteur: string;
  dateAjout: string;
  statut: "validee" | "en_attente" | "refusee";
  telechargements: number;
  note: number;
  taille: string;
}

type FiltreType = "tous" | Ressource["type"];
type FiltreStatut = "tous" | Ressource["statut"];

export default function GestionRessources() {
  const [recherche, setRecherche] = useState("");
  const [filtreType, setFiltreType] = useState<FiltreType>("tous");
  const [filtreStatut, setFiltreStatut] = useState<FiltreStatut>("tous");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [ressourceSelectionnee, setRessourceSelectionnee] = useState<Ressource | null>(null);
  const [vueMode, setVueMode] = useState<"grille" | "liste">("liste");

  // Données de démonstration
  const ressources: Ressource[] = [
    {
      id: 1,
      titre: "Analyse Mathématique - Tome 2",
      type: "livre",
      matiere: "Mathématiques",
      filiere: "MPCI",
      niveau: "Licence 2",
      auteur: "Ahmed Benali",
      dateAjout: "2024-01-15",
      statut: "en_attente",
      telechargements: 0,
      note: 0,
      taille: "15.2 MB",
    },
    {
      id: 2,
      titre: "Examen Final Physique Quantique 2024",
      type: "sujet",
      matiere: "Physique",
      filiere: "MPI",
      niveau: "Licence 3",
      auteur: "Sarah Martin",
      dateAjout: "2024-01-14",
      statut: "validee",
      telechargements: 234,
      note: 4.7,
      taille: "2.3 MB",
    },
    {
      id: 3,
      titre: "Correction Algèbre Linéaire",
      type: "correction",
      matiere: "Mathématiques",
      filiere: "MPCI",
      niveau: "Licence 2",
      auteur: "Karim El Haddad",
      dateAjout: "2024-01-13",
      statut: "validee",
      telechargements: 567,
      note: 4.9,
      taille: "5.1 MB",
    },
    {
      id: 4,
      titre: "Cours Thermodynamique",
      type: "cours",
      matiere: "Physique",
      filiere: "MP",
      niveau: "Licence 3",
      auteur: "Fatima Zahra",
      dateAjout: "2024-01-12",
      statut: "en_attente",
      telechargements: 0,
      note: 0,
      taille: "8.7 MB",
    },
    {
      id: 5,
      titre: "Programmation C++ Avancée",
      type: "livre",
      matiere: "Informatique",
      filiere: "MIPC",
      niveau: "Master 1",
      auteur: "Mohammed Alami",
      dateAjout: "2024-01-10",
      statut: "refusee",
      telechargements: 0,
      note: 0,
      taille: "22.5 MB",
    },
  ];

  const ressourcesFiltrees = ressources.filter((ressource) => {
    const matchRecherche =
      ressource.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      ressource.auteur.toLowerCase().includes(recherche.toLowerCase());
    const matchType = filtreType === "tous" || ressource.type === filtreType;
    const matchStatut = filtreStatut === "tous" || ressource.statut === filtreStatut;

    return matchRecherche && matchType && matchStatut;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "livre":
        return "bg-purple-100 text-purple-800";
      case "sujet":
        return "bg-blue-100 text-blue-800";
      case "correction":
        return "bg-green-100 text-green-800";
      case "cours":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "validee":
        return "bg-green-100 text-green-800";
      case "en_attente":
        return "bg-yellow-100 text-yellow-800";
      case "refusee":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "livre":
        return "Livre";
      case "sujet":
        return "Sujet";
      case "correction":
        return "Correction";
      case "cours":
        return "Cours";
      default:
        return type;
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case "validee":
        return "Validée";
      case "en_attente":
        return "En attente";
      case "refusee":
        return "Refusée";
      default:
        return statut;
    }
  };

  const stats = {
    total: ressources.length,
    validees: ressources.filter((r) => r.statut === "validee").length,
    enAttente: ressources.filter((r) => r.statut === "en_attente").length,
    refusees: ressources.filter((r) => r.statut === "refusee").length,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des ressources</h1>
        <p className="text-gray-600">Gérez et validez les ressources de la plateforme</p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Total ressources</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Validées</p>
          <p className="text-3xl font-bold text-green-600">{stats.validees}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">En attente</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.enAttente}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Refusées</p>
          <p className="text-3xl font-bold text-red-600">{stats.refusees}</p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Rechercher une ressource..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          <select
            value={filtreType}
            onChange={(e) => setFiltreType(e.target.value as FiltreType)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="tous">Tous les types</option>
            <option value="livre">Livres</option>
            <option value="sujet">Sujets</option>
            <option value="correction">Corrections</option>
            <option value="cours">Cours</option>
          </select>

          <select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value as FiltreStatut)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="tous">Tous les statuts</option>
            <option value="validee">Validées</option>
            <option value="en_attente">En attente</option>
            <option value="refusee">Refusées</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setVueMode("liste")}
              className={`flex-1 p-2 border rounded-lg transition-colors ${
                vueMode === "liste"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setVueMode("grille")}
              className={`flex-1 p-2 border rounded-lg transition-colors ${
                vueMode === "grille"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Vue Liste */}
      {vueMode === "liste" && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Liste des ressources ({ressourcesFiltrees.length})
            </h2>
            <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
              + Ajouter une ressource
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ressource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Filière / Niveau
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auteur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ressourcesFiltrees.map((ressource) => (
                  <tr key={ressource.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{ressource.titre}</p>
                        <p className="text-xs text-gray-500">
                          {ressource.matiere} • {ressource.taille}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeBadge(ressource.type)}`}>
                        {getTypeLabel(ressource.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {ressource.filiere} - {ressource.niveau}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {ressource.auteur}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatutBadge(ressource.statut)}`}>
                        {getStatutLabel(ressource.statut)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="space-y-1">
                        <p>{ressource.telechargements} téléchargements</p>
                        {ressource.note > 0 && (
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-yellow-500 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="text-xs">{ressource.note}/5</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {ressource.statut === "en_attente" && (
                          <>
                            <button className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded transition-colors" title="Valider">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors" title="Refuser">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setRessourceSelectionnee(ressource);
                            setModalOuvert(true);
                          }}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                          title="Voir détails"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors" title="Supprimer">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {ressourcesFiltrees.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune ressource trouvée</p>
            </div>
          )}
        </div>
      )}

      {/* Vue Grille */}
      {vueMode === "grille" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Ressources ({ressourcesFiltrees.length})
            </h2>
            <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
              + Ajouter une ressource
            </button>
          </div>

          {ressourcesFiltrees.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">Aucune ressource trouvée</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ressourcesFiltrees.map((ressource) => (
                <div
                  key={ressource.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeBadge(ressource.type)}`}>
                      {getTypeLabel(ressource.type)}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatutBadge(ressource.statut)}`}>
                      {getStatutLabel(ressource.statut)}
                    </span>
                  </div>

                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{ressource.titre}</h3>
                  
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <p>📚 {ressource.matiere}</p>
                    <p>🎓 {ressource.filiere} - {ressource.niveau}</p>
                    <p>👤 {ressource.auteur}</p>
                    <p>💾 {ressource.taille}</p>
                  </div>

                  {ressource.statut === "validee" && (
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pt-4 border-t border-gray-200">
                      <span>{ressource.telechargements} DL</span>
                      {ressource.note > 0 && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span>{ressource.note}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {ressource.statut === "en_attente" ? (
                      <>
                        <button className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors">
                          Valider
                        </button>
                        <button className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors">
                          Refuser
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setRessourceSelectionnee(ressource);
                          setModalOuvert(true);
                        }}
                        className="flex-1 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
                      >
                        Voir détails
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal détails ressource */}
      {modalOuvert && ressourceSelectionnee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Détails de la ressource</h3>
              <button
                onClick={() => setModalOuvert(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{ressourceSelectionnee.titre}</h4>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded ${getTypeBadge(ressourceSelectionnee.type)}`}>
                    {getTypeLabel(ressourceSelectionnee.type)}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded ${getStatutBadge(ressourceSelectionnee.statut)}`}>
                    {getStatutLabel(ressourceSelectionnee.statut)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Matière</p>
                  <p className="text-sm font-medium text-gray-900">{ressourceSelectionnee.matiere}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Filière</p>
                  <p className="text-sm font-medium text-gray-900">{ressourceSelectionnee.filiere}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Niveau</p>
                  <p className="text-sm font-medium text-gray-900">{ressourceSelectionnee.niveau}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Taille</p>
                  <p className="text-sm font-medium text-gray-900">{ressourceSelectionnee.taille}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Auteur</p>
                  <p className="text-sm font-medium text-gray-900">{ressourceSelectionnee.auteur}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date d&apos;ajout</p>
                  <p className="text-sm font-medium text-gray-900">{ressourceSelectionnee.dateAjout}</p>
                </div>
              </div>

              {ressourceSelectionnee.statut === "validee" && (
                <div className="border-t border-gray-200 pt-6">
                  <h5 className="font-semibold text-gray-900 mb-4">Statistiques</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-600 mb-1">Téléchargements</p>
                      <p className="text-2xl font-bold text-blue-900">{ressourceSelectionnee.telechargements}</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-600 mb-1">Note moyenne</p>
                      <p className="text-2xl font-bold text-yellow-900">{ressourceSelectionnee.note}/5</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-6 flex gap-3">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Télécharger
                </button>
                {ressourceSelectionnee.statut === "en_attente" && (
                  <>
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                      Valider
                    </button>
                    <button className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                      Refuser
                    </button>
                  </>
                )}
                {ressourceSelectionnee.statut !== "en_attente" && (
                  <button className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
