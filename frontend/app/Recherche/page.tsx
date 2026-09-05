"use client";
import Link from "next/link";
import { useState } from "react";

// Données de démonstration - tous types de ressources
const ressources = [
  { id: 1, type: "Livre", titre: "Mathématiques - Algèbre Linéaire", matiere: "Mathématiques", niveau: "Licence 2", auteur: "Jean Dupont" },
  { id: 2, type: "Cours", titre: "Notes de cours - Analyse Mathématique", matiere: "Mathématiques", niveau: "Licence 2", auteur: "Prof. Dupont" },
  { id: 3, type: "Sujet", titre: "Examen Final - Analyse Mathématique", matiere: "Mathématiques", niveau: "Licence 2", auteur: "Université" },
  { id: 4, type: "Correction", titre: "Correction - Analyse Mathématique 2023", matiere: "Mathématiques", niveau: "Licence 2", auteur: "Prof. Dupont" },
  { id: 5, type: "Livre", titre: "Physique Quantique - Introduction", matiere: "Physique", niveau: "Licence 3", auteur: "Marie Martin" },
  { id: 6, type: "Livre", titre: "Programmation Python Avancée", matiere: "Informatique", niveau: "Master 1", auteur: "Ahmed Benali" },
  { id: 7, type: "Cours", titre: "Fiche de révision - Mécanique quantique", matiere: "Physique", niveau: "Licence 3", auteur: "Prof. Martin" },
  { id: 8, type: "Sujet", titre: "Partiel - Mécanique Quantique", matiere: "Physique", niveau: "Licence 3", auteur: "Université" },
];

const types = ["Tous", "Livre", "Cours", "Sujet", "Correction"];
const matieres = ["Toutes", "Mathématiques", "Physique", "Informatique", "Économie", "Chimie", "Droit"];
const niveaux = ["Tous", "Licence 1", "Licence 2", "Licence 3", "Master 1", "Master 2"];

export default function RecherchePage() {
  const [recherche, setRecherche] = useState("");
  const [typeFiltre, setTypeFiltre] = useState("Tous");
  const [matiereFiltre, setMatiereFiltre] = useState("Toutes");
  const [niveauFiltre, setNiveauFiltre] = useState("Tous");

  const ressourcesFiltrees = ressources.filter((ressource) => {
    const matchRecherche =
      ressource.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      ressource.auteur.toLowerCase().includes(recherche.toLowerCase());
    const matchType = typeFiltre === "Tous" || ressource.type === typeFiltre;
    const matchMatiere = matiereFiltre === "Toutes" || ressource.matiere === matiereFiltre;
    const matchNiveau = niveauFiltre === "Tous" || ressource.niveau === niveauFiltre;

    return matchRecherche && matchType && matchMatiere && matchNiveau;
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

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">Recherche</h1>
          <p className="text-black/60 text-lg">
            Trouvez rapidement toutes vos ressources académiques en un seul endroit
          </p>
        </div>
      </div>

      {/* Barre de recherche principale */}
      <div className="border-b border-black/10 bg-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Rechercher des livres, cours, sujets, corrections..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full px-6 py-4 pr-12 bg-white border border-black/10 rounded-lg focus:outline-none focus:border-black/30 transition-colors text-lg"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 absolute right-4 top-1/2 -translate-y-1/2 text-black/40"
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
        </div>
      </div>

      {/* Filtres */}
      <div className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <select
              value={matiereFiltre}
              onChange={(e) => setMatiereFiltre(e.target.value)}
              className="px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
            >
              {matieres.map((matiere) => (
                <option key={matiere} value={matiere}>
                  {matiere === "Toutes" ? "Toutes les matières" : matiere}
                </option>
              ))}
            </select>

            <select
              value={niveauFiltre}
              onChange={(e) => setNiveauFiltre(e.target.value)}
              className="px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
            >
              {niveaux.map((niveau) => (
                <option key={niveau} value={niveau}>
                  {niveau === "Tous" ? "Tous les niveaux" : niveau}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <p className="text-black/60">
            {ressourcesFiltrees.length} résultat{ressourcesFiltrees.length > 1 ? "s" : ""} trouvé{ressourcesFiltrees.length > 1 ? "s" : ""}
          </p>
        </div>

        {recherche === "" && typeFiltre === "Tous" && matiereFiltre === "Toutes" && niveauFiltre === "Tous" ? (
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto mb-4 text-black/20"
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
            <p className="text-black/40 text-lg">Commencez votre recherche...</p>
          </div>
        ) : ressourcesFiltrees.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-black/40 text-lg">Aucun résultat trouvé</p>
            <p className="text-sm text-black/40 mt-2">Essayez avec d&apos;autres mots-clés ou filtres</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ressourcesFiltrees.map((ressource) => (
              <div
                key={ressource.id}
                className="border border-black/10 rounded-lg p-6 hover:border-black/30 transition-all hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-black/40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {getTypeIcon(ressource.type)}
                    </svg>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{ressource.titre}</h3>
                        <p className="text-sm text-black/60">Par {ressource.auteur}</p>
                      </div>
                      <span className="px-3 py-1 bg-black/5 text-xs rounded-md whitespace-nowrap">
                        {ressource.type}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-black/5 text-xs rounded-md">{ressource.matiere}</span>
                      <span className="px-2 py-1 bg-black/5 text-xs rounded-md">{ressource.niveau}</span>
                    </div>

                    <div className="flex gap-2">
                      <button className="px-6 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-black/90 transition-all">
                        Voir
                      </button>
                      <button className="px-3 py-2 border border-black/20 rounded-md hover:bg-black/5 transition-all">
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
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
