"use client";
import Link from "next/link";
import { useState } from "react";

// Données de démonstration
const supports = [
  {
    id: 1,
    titre: "Notes de cours - Analyse Mathématique",
    type: "Notes de cours",
    auteur: "Prof. Dupont",
    matiere: "Mathématiques",
    niveau: "Licence 2",
    pages: 85,
    telechargements: 567,
  },
  {
    id: 2,
    titre: "Fiche de révision - Mécanique quantique",
    type: "Fiche de révision",
    auteur: "Prof. Martin",
    matiere: "Physique",
    niveau: "Licence 3",
    pages: 12,
    telechargements: 892,
  },
  {
    id: 3,
    titre: "Travaux dirigés - Structures de données",
    type: "TD",
    auteur: "Prof. Benali",
    matiere: "Informatique",
    niveau: "Licence 2",
    pages: 45,
    telechargements: 1234,
  },
  {
    id: 4,
    titre: "Support PowerPoint - Macroéconomie",
    type: "Présentation",
    auteur: "Prof. Laurent",
    matiere: "Économie",
    niveau: "Licence 3",
    pages: 68,
    telechargements: 423,
  },
  {
    id: 5,
    titre: "Résumé de cours - Réactions chimiques",
    type: "Résumé",
    auteur: "Prof. Dubois",
    matiere: "Chimie",
    niveau: "Licence 1",
    pages: 25,
    telechargements: 678,
  },
  {
    id: 6,
    titre: "Cours complet - Droit des contrats",
    type: "Cours complet",
    auteur: "Prof. Rousseau",
    matiere: "Droit",
    niveau: "Licence 2",
    pages: 120,
    telechargements: 945,
  },
];

const types = ["Tous", "Notes de cours", "Fiche de révision", "TD", "Présentation", "Résumé", "Cours complet"];
const matieres = ["Toutes", "Mathématiques", "Physique", "Informatique", "Économie", "Chimie", "Droit"];
const niveaux = ["Tous", "Licence 1", "Licence 2", "Licence 3", "Master 1", "Master 2"];

export default function CoursSupportsPage() {
  const [recherche, setRecherche] = useState("");
  const [typeFiltre, setTypeFiltre] = useState("Tous");
  const [matiereFiltre, setMatiereFiltre] = useState("Toutes");
  const [niveauFiltre, setNiveauFiltre] = useState("Tous");

  const supportsFiltres = supports.filter((support) => {
    const matchRecherche =
      support.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      support.auteur.toLowerCase().includes(recherche.toLowerCase());
    const matchType = typeFiltre === "Tous" || support.type === typeFiltre;
    const matchMatiere = matiereFiltre === "Toutes" || support.matiere === matiereFiltre;
    const matchNiveau = niveauFiltre === "Tous" || support.niveau === niveauFiltre;

    return matchRecherche && matchType && matchMatiere && matchNiveau;
  });

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">Cours & Supports</h1>
          <p className="text-black/60 text-lg">
            Notes de cours, fiches de révision et supports pédagogiques
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="border-b border-black/10 bg-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Recherche */}
            <input
              type="text"
              placeholder="Rechercher..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
            />

            {/* Type */}
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

            {/* Matière */}
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

            {/* Niveau */}
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

      {/* Liste */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <p className="text-black/60">
            {supportsFiltres.length} document{supportsFiltres.length > 1 ? "s" : ""} trouvé{supportsFiltres.length > 1 ? "s" : ""}
          </p>
        </div>

        <div className="space-y-4">
          {supportsFiltres.map((support) => (
            <div
              key={support.id}
              className="border border-black/10 rounded-lg p-6 hover:border-black/30 transition-all hover:shadow-lg"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-black/40"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{support.titre}</h3>
                      <p className="text-sm text-black/60 mb-3">Par {support.auteur}</p>

                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-black/5 text-xs rounded-md">{support.type}</span>
                        <span className="px-2 py-1 bg-black/5 text-xs rounded-md">{support.matiere}</span>
                        <span className="px-2 py-1 bg-black/5 text-xs rounded-md">{support.niveau}</span>
                        <span className="px-2 py-1 bg-black/5 text-xs rounded-md">{support.pages} pages</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:flex-col md:items-end">
                  <p className="text-xs text-black/60 whitespace-nowrap">
                    {support.telechargements} téléchargements
                  </p>
                  <div className="flex gap-2">
                    <button className="px-6 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-black/90 transition-all whitespace-nowrap">
                      Télécharger
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

        {supportsFiltres.length === 0 && (
          <div className="text-center py-12">
            <p className="text-black/40 text-lg">Aucun document trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
