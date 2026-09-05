"use client";
import { useState } from "react";

// Données de démonstration
const favoris = [
  {
    id: 1,
    type: "Livre",
    titre: "Mathématiques - Algèbre Linéaire",
    auteur: "Jean Dupont",
    matiere: "Mathématiques",
    niveau: "Licence 2",
    dateAjout: "Il y a 2 jours",
  },
  {
    id: 2,
    type: "Cours",
    titre: "Notes de cours - Analyse Mathématique",
    auteur: "Prof. Dupont",
    matiere: "Mathématiques",
    niveau: "Licence 2",
    dateAjout: "Il y a 3 jours",
  },
  {
    id: 3,
    type: "Sujet",
    titre: "Examen Final - Analyse Mathématique",
    auteur: "Université",
    matiere: "Mathématiques",
    niveau: "Licence 2",
    dateAjout: "Il y a 5 jours",
  },
  {
    id: 4,
    type: "Correction",
    titre: "Correction - Analyse Mathématique 2023",
    auteur: "Prof. Dupont",
    matiere: "Mathématiques",
    niveau: "Licence 2",
    dateAjout: "Il y a 1 semaine",
  },
  {
    id: 5,
    type: "Livre",
    titre: "Physique Quantique - Introduction",
    auteur: "Marie Martin",
    matiere: "Physique",
    niveau: "Licence 3",
    dateAjout: "Il y a 1 semaine",
  },
];

const types = ["Tous", "Livre", "Cours", "Sujet", "Correction"];

export default function FavorisPage() {
  const [typeFiltre, setTypeFiltre] = useState("Tous");
  const [recherche, setRecherche] = useState("");

  const favorisFiltres = favoris.filter((favori) => {
    const matchType = typeFiltre === "Tous" || favori.type === typeFiltre;
    const matchRecherche = favori.titre.toLowerCase().includes(recherche.toLowerCase());
    return matchType && matchRecherche;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Livre":
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        );
      case "Cours":
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        );
      case "Sujet":
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        );
      case "Correction":
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        );
      default:
        return null;
    }
  };

  const retirerDesFavoris = (id: number) => {
    // Logique pour retirer des favoris
    console.log("Retirer favori:", id);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">Mes Favoris</h1>
          <p className="text-black/60 text-lg">
            Retrouvez toutes vos ressources sauvegardées en un seul endroit
          </p>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="border-b border-black/10 bg-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Rechercher dans mes favoris..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full px-4 py-2 pr-10 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-black/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Filtre type */}
            <select
              value={typeFiltre}
              onChange={(e) => setTypeFiltre(e.target.value)}
              className="px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type === "Tous" ? "Tous les types" : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-black/60">
              {favorisFiltres.length} élément{favorisFiltres.length > 1 ? "s" : ""} dans vos favoris
            </p>
            {favorisFiltres.length > 0 && (
              <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                Tout supprimer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Liste des favoris */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {favorisFiltres.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-black/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <p className="text-black/40 text-lg mb-2">Aucun favori trouvé</p>
            <p className="text-sm text-black/40">
              {recherche || typeFiltre !== "Tous"
                ? "Essayez de modifier vos filtres"
                : "Commencez à sauvegarder vos ressources préférées"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {favorisFiltres.map((favori) => (
              <div
                key={favori.id}
                className="border border-black/10 rounded-lg p-6 hover:border-black/30 transition-all hover:shadow-lg group"
              >
                <div className="flex items-start gap-4">
                  {/* Icône */}
                  <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-black/10 transition-all">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-black/40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {getTypeIcon(favori.type)}
                    </svg>
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{favori.titre}</h3>
                        <p className="text-sm text-black/60">Par {favori.auteur}</p>
                      </div>
                      <span className="px-3 py-1 bg-black/5 text-xs rounded-md whitespace-nowrap">
                        {favori.type}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 bg-black/5 text-xs rounded-md">
                        {favori.matiere}
                      </span>
                      <span className="px-2 py-1 bg-black/5 text-xs rounded-md">
                        {favori.niveau}
                      </span>
                      <span className="px-2 py-1 bg-black/5 text-xs rounded-md">
                        Ajouté {favori.dateAjout}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button className="px-6 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-black/90 transition-all">
                        Ouvrir
                      </button>
                      <button
                        onClick={() => retirerDesFavoris(favori.id)}
                        className="px-4 py-2 border border-black/20 text-sm rounded-md hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA si pas de favoris */}
      {favoris.length === 0 && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-center">
          <div className="border border-black/10 rounded-lg p-8">
            <h2 className="text-xl font-bold mb-3">Commencez à organiser vos ressources</h2>
            <p className="text-black/60 mb-6">
              Sauvegardez vos livres, cours, sujets et corrections préférés pour y accéder
              rapidement plus tard
            </p>
            <a
              href="/Recherche"
              className="inline-block px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-black/90 transition-all"
            >
              Explorer les ressources
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
