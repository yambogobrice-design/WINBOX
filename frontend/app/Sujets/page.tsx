"use client";
import { useState } from "react";

// Données de démonstration
const sujets = [
  {
    id: 1,
    titre: "Examen Final - Analyse Mathématique",
    matiere: "Mathématiques",
    niveau: "Licence 2",
    annee: "2023",
    session: "Session 1",
    duree: "3h",
    telechargements: 1456,
  },
  {
    id: 2,
    titre: "Partiel - Mécanique Quantique",
    matiere: "Physique",
    niveau: "Licence 3",
    annee: "2023",
    session: "Session 2",
    duree: "2h",
    telechargements: 892,
  },
  {
    id: 3,
    titre: "Examen - Algorithmes et Structures de Données",
    matiere: "Informatique",
    niveau: "Licence 2",
    annee: "2024",
    session: "Session 1",
    duree: "3h",
    telechargements: 2103,
  },
  {
    id: 4,
    titre: "Contrôle Continu - Macroéconomie",
    matiere: "Économie",
    niveau: "Licence 3",
    annee: "2023",
    session: "Session 1",
    duree: "1h30",
    telechargements: 645,
  },
  {
    id: 5,
    titre: "Examen Final - Chimie Organique",
    matiere: "Chimie",
    niveau: "Licence 2",
    annee: "2024",
    session: "Session 2",
    duree: "2h30",
    telechargements: 1234,
  },
  {
    id: 6,
    titre: "Partiel - Droit Constitutionnel",
    matiere: "Droit",
    niveau: "Licence 1",
    annee: "2023",
    session: "Session 1",
    duree: "2h",
    telechargements: 1789,
  },
];

const matieres = ["Toutes", "Mathématiques", "Physique", "Informatique", "Économie", "Chimie", "Droit"];
const niveaux = ["Tous", "Licence 1", "Licence 2", "Licence 3", "Master 1", "Master 2"];
const annees = ["Toutes", "2024", "2023", "2022", "2021"];

export default function SujetsPage() {
  const [recherche, setRecherche] = useState("");
  const [matiereFiltre, setMatiereFiltre] = useState("Toutes");
  const [niveauFiltre, setNiveauFiltre] = useState("Tous");
  const [anneeFiltre, setAnneeFiltre] = useState("Toutes");

  const sujetsFiltres = sujets.filter((sujet) => {
    const matchRecherche = sujet.titre.toLowerCase().includes(recherche.toLowerCase());
    const matchMatiere = matiereFiltre === "Toutes" || sujet.matiere === matiereFiltre;
    const matchNiveau = niveauFiltre === "Tous" || sujet.niveau === niveauFiltre;
    const matchAnnee = anneeFiltre === "Toutes" || sujet.annee === anneeFiltre;

    return matchRecherche && matchMatiere && matchNiveau && matchAnnee;
  });

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">Sujets d&apos;examens</h1>
          <p className="text-black/60 text-lg">
            Anciens sujets et exercices types pour mieux vous préparer
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
              placeholder="Rechercher un sujet..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
            />

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

            {/* Année */}
            <select
              value={anneeFiltre}
              onChange={(e) => setAnneeFiltre(e.target.value)}
              className="px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
            >
              {annees.map((annee) => (
                <option key={annee} value={annee}>
                  {annee === "Toutes" ? "Toutes les années" : annee}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des sujets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <p className="text-black/60">
            {sujetsFiltres.length} sujet{sujetsFiltres.length > 1 ? "s" : ""} trouvé{sujetsFiltres.length > 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {sujetsFiltres.map((sujet) => (
            <div
              key={sujet.id}
              className="border border-black/10 rounded-lg p-6 hover:border-black/30 transition-all hover:shadow-lg"
            >
              <div className="flex items-start gap-4 mb-4">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{sujet.titre}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-black/5 text-xs rounded-md">{sujet.matiere}</span>
                    <span className="px-2 py-1 bg-black/5 text-xs rounded-md">{sujet.niveau}</span>
                    <span className="px-2 py-1 bg-black/5 text-xs rounded-md">{sujet.annee}</span>
                    <span className="px-2 py-1 bg-black/5 text-xs rounded-md">{sujet.session}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-black/60 mb-4">
                    <span>Durée: {sujet.duree}</span>
                    <span>•</span>
                    <span>{sujet.telechargements} téléchargements</span>
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sujetsFiltres.length === 0 && (
          <div className="text-center py-12">
            <p className="text-black/40 text-lg">Aucun sujet trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
