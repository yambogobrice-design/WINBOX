"use client";
import Link from "next/link";
import { useState } from "react";

// Données de démonstration
const quiz = [
  {
    id: 1,
    titre: "Quiz - Analyse Mathématique",
    matiere: "Mathématiques",
    niveau: "Licence 2",
    questions: 20,
    duree: "30 min",
    difficulte: "Moyen",
    participants: 1234,
    note: 4.5,
  },
  {
    id: 2,
    titre: "Challenge - Mécanique Quantique",
    matiere: "Physique",
    niveau: "Licence 3",
    questions: 15,
    duree: "25 min",
    difficulte: "Difficile",
    participants: 567,
    note: 4.7,
  },
  {
    id: 3,
    titre: "Test - Algorithmes de tri",
    matiere: "Informatique",
    niveau: "Licence 2",
    questions: 25,
    duree: "40 min",
    difficulte: "Moyen",
    participants: 2103,
    note: 4.8,
  },
  {
    id: 4,
    titre: "Quiz Rapide - Macroéconomie",
    matiere: "Économie",
    niveau: "Licence 3",
    questions: 10,
    duree: "15 min",
    difficulte: "Facile",
    participants: 890,
    note: 4.3,
  },
  {
    id: 5,
    titre: "Challenge - Réactions chimiques",
    matiere: "Chimie",
    niveau: "Licence 1",
    questions: 18,
    duree: "30 min",
    difficulte: "Moyen",
    participants: 1456,
    note: 4.6,
  },
  {
    id: 6,
    titre: "Quiz - Droit des contrats",
    matiere: "Droit",
    niveau: "Licence 2",
    questions: 22,
    duree: "35 min",
    difficulte: "Difficile",
    participants: 678,
    note: 4.4,
  },
];

const matieres = ["Toutes", "Mathématiques", "Physique", "Informatique", "Économie", "Chimie", "Droit"];
const difficultes = ["Toutes", "Facile", "Moyen", "Difficile"];

export default function WinZonePage() {
  const [matiereFiltre, setMatiereFiltre] = useState("Toutes");
  const [difficulteFiltre, setDifficulteFiltre] = useState("Toutes");

  const quizFiltres = quiz.filter((q) => {
    const matchMatiere = matiereFiltre === "Toutes" || q.matiere === matiereFiltre;
    const matchDifficulte = difficulteFiltre === "Toutes" || q.difficulte === difficulteFiltre;
    return matchMatiere && matchDifficulte;
  });

  const getDifficulteColor = (difficulte: string) => {
    switch (difficulte) {
      case "Facile":
        return "bg-green-100 text-green-800";
      case "Moyen":
        return "bg-yellow-100 text-yellow-800";
      case "Difficile":
        return "bg-red-100 text-red-800";
      default:
        return "bg-black/5";
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="border-b border-black/10 bg-gradient-to-br from-black/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 bg-black/5 border border-black/10 rounded-full text-sm mb-4">
              🎮 Zone de jeux
            </div>
            <h1 className="text-5xl font-bold mb-4">WinZone</h1>
            <p className="text-black/60 text-lg">
              Testez vos connaissances avec des quiz interactifs et des défis académiques. Apprenez en vous amusant !
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold mb-1">50+</p>
              <p className="text-sm text-black/60">Quiz disponibles</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold mb-1">12K+</p>
              <p className="text-sm text-black/60">Participants</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold mb-1">4.6/5</p>
              <p className="text-sm text-black/60">Note moyenne</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold mb-1">250K+</p>
              <p className="text-sm text-black/60">Questions répondues</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="border-b border-black/10 bg-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-4">
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
              value={difficulteFiltre}
              onChange={(e) => setDifficulteFiltre(e.target.value)}
              className="px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
            >
              {difficultes.map((difficulte) => (
                <option key={difficulte} value={difficulte}>
                  {difficulte === "Toutes" ? "Toutes difficultés" : difficulte}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des quiz */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizFiltres.map((q) => (
            <div
              key={q.id}
              className="border border-black/10 rounded-lg p-6 hover:border-black/30 transition-all hover:shadow-lg group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center group-hover:bg-black/10 transition-all">
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
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <span className={`px-2 py-1 text-xs rounded-md ${getDifficulteColor(q.difficulte)}`}>
                  {q.difficulte}
                </span>
              </div>

              <h3 className="font-semibold text-lg mb-2">{q.titre}</h3>
              <p className="text-sm text-black/60 mb-4">{q.matiere} • {q.niveau}</p>

              <div className="flex items-center gap-4 text-xs text-black/60 mb-4 pb-4 border-b border-black/10">
                <span>{q.questions} questions</span>
                <span>•</span>
                <span>{q.duree}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-sm text-black/60">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  {q.participants}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-yellow-500 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {q.note}
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-black/90 transition-all">
                Commencer le quiz
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
