"use client";
import Link from "next/link";
import { useState } from "react";

// Données de démonstration
const livres = [
  {
    id: 1,
    titre: "Mathématiques - Algèbre Linéaire",
    auteur: "Jean Dupont",
    niveau: "Licence 2",
    matiere: "Mathématiques",
    pages: 450,
    telechargements: 1234,
  },
  {
    id: 2,
    titre: "Physique Quantique - Introduction",
    auteur: "Marie Martin",
    niveau: "Licence 3",
    matiere: "Physique",
    pages: 380,
    telechargements: 892,
  },
  {
    id: 3,
    titre: "Programmation Python Avancée",
    auteur: "Ahmed Benali",
    niveau: "Master 1",
    matiere: "Informatique",
    pages: 520,
    telechargements: 2156,
  },
  {
    id: 4,
    titre: "Analyse Financière",
    auteur: "Sophie Laurent",
    niveau: "Licence 3",
    matiere: "Économie",
    pages: 320,
    telechargements: 678,
  },
  {
    id: 5,
    titre: "Chimie Organique",
    auteur: "Pierre Dubois",
    niveau: "Licence 2",
    matiere: "Chimie",
    pages: 410,
    telechargements: 945,
  },
  {
    id: 6,
    titre: "Droit Constitutionnel",
    auteur: "Claire Rousseau",
    niveau: "Licence 1",
    matiere: "Droit",
    pages: 280,
    telechargements: 1567,
  },
];

const niveaux = ["Tous", "Licence 1", "Licence 2", "Licence 3", "Master 1", "Master 2"];
const matieres = ["Toutes", "Mathématiques", "Physique", "Informatique", "Économie", "Chimie", "Droit"];

export default function LivresPage() {
  const [recherche, setRecherche] = useState("");
  const [niveauFiltre, setNiveauFiltre] = useState("Tous");
  const [matiereFiltre, setMatiereFiltre] = useState("Toutes");

  const livresFiltres = livres.filter((livre) => {
    const matchRecherche =
      livre.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      livre.auteur.toLowerCase().includes(recherche.toLowerCase());
    const matchNiveau = niveauFiltre === "Tous" || livre.niveau === niveauFiltre;
    const matchMatiere = matiereFiltre === "Toutes" || livre.matiere === matiereFiltre;

    return matchRecherche && matchNiveau && matchMatiere;
  });

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">Bibliothèque</h1>
          <p className="text-black/60 text-lg">
            Accédez à une collection complète de manuels et ouvrages de référence
          </p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="border-b border-black/10 bg-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Rechercher un livre..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
              />
            </div>

            {/* Filtre Niveau */}
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

            {/* Filtre Matière */}
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
          </div>
        </div>
      </div>

      {/* Liste des livres */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 flex justify-between items-center">
          <p className="text-black/60">
            {livresFiltres.length} livre{livresFiltres.length > 1 ? "s" : ""} trouvé{livresFiltres.length > 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {livresFiltres.map((livre) => (
            <div
              key={livre.id}
              className="border border-black/10 rounded-lg p-6 hover:border-black/30 transition-all hover:shadow-lg"
            >
              {/* Placeholder livre */}
              <div className="w-full h-48 bg-black/5 rounded-md mb-4 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-black/20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>

              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{livre.titre}</h3>
              <p className="text-sm text-black/60 mb-4">Par {livre.auteur}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-black/5 text-xs rounded-md">{livre.niveau}</span>
                <span className="px-2 py-1 bg-black/5 text-xs rounded-md">{livre.matiere}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-black/60 mb-4">
                <span>{livre.pages} pages</span>
                <span>{livre.telechargements} téléchargements</span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-black/90 transition-all">
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
          ))}
        </div>

        {livresFiltres.length === 0 && (
          <div className="text-center py-12">
            <p className="text-black/40 text-lg">Aucun livre trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
