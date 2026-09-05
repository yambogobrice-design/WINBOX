"use client";
import { useState } from "react";

// Données de démonstration
const classementGeneral = [
  { rang: 1, nom: "Sophie Martin", points: 12450, quizCompletes: 85, tauxReussite: 95 },
  { rang: 2, nom: "Ahmed Benali", points: 11230, quizCompletes: 78, tauxReussite: 93 },
  { rang: 3, nom: "Marie Dubois", points: 10890, quizCompletes: 82, tauxReussite: 92 },
  { rang: 4, nom: "Jean Dupont", points: 9870, quizCompletes: 75, tauxReussite: 90 },
  { rang: 5, nom: "Claire Rousseau", points: 9340, quizCompletes: 71, tauxReussite: 89 },
  { rang: 6, nom: "Pierre Laurent", points: 8920, quizCompletes: 68, tauxReussite: 88 },
  { rang: 7, nom: "Fatima Diallo", points: 8560, quizCompletes: 65, tauxReussite: 87 },
  { rang: 8, nom: "Thomas Bernard", points: 8120, quizCompletes: 63, tauxReussite: 86 },
  { rang: 9, nom: "Aminata Sow", points: 7890, quizCompletes: 60, tauxReussite: 85 },
  { rang: 10, nom: "Lucas Petit", points: 7650, quizCompletes: 58, tauxReussite: 84 },
];

const matieres = ["Général", "Mathématiques", "Physique", "Informatique", "Économie", "Chimie", "Droit"];
const periodes = ["Ce mois", "Cette semaine", "Aujourd'hui", "Tout temps"];

export default function WinRankPage() {
  const [matiereFiltre, setMatiereFiltre] = useState("Général");
  const [periodeFiltre, setPeriodeFiltre] = useState("Ce mois");

  const getMedalColor = (rang: number) => {
    switch (rang) {
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-orange-600";
      default:
        return "text-black/40";
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="border-b border-black/10 bg-gradient-to-br from-black/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 bg-black/5 border border-black/10 rounded-full text-sm mb-4">
              🏆 Classements
            </div>
            <h1 className="text-5xl font-bold mb-4">WinRank</h1>
            <p className="text-black/60 text-lg">
              Découvrez votre classement et comparez vos performances avec la communauté
            </p>
          </div>
        </div>
      </div>

      {/* Mon classement */}
      <div className="border-b border-black/10 bg-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border border-black/10 rounded-lg p-6">
            <h2 className="font-semibold text-lg mb-4">Mon classement</h2>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center text-2xl font-bold">
                  #42
                </div>
                <div>
                  <p className="font-semibold text-lg">Vous</p>
                  <p className="text-sm text-black/60">Licence 2 - Informatique</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">5,420</p>
                  <p className="text-xs text-black/60">Points</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">42</p>
                  <p className="text-xs text-black/60">Quiz</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">82%</p>
                  <p className="text-xs text-black/60">Réussite</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={matiereFiltre}
              onChange={(e) => setMatiereFiltre(e.target.value)}
              className="px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
            >
              {matieres.map((matiere) => (
                <option key={matiere} value={matiere}>
                  {matiere}
                </option>
              ))}
            </select>

            <select
              value={periodeFiltre}
              onChange={(e) => setPeriodeFiltre(e.target.value)}
              className="px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
            >
              {periodes.map((periode) => (
                <option key={periode} value={periode}>
                  {periode}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Classement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-6">Classement {matiereFiltre}</h2>

        {/* Podium - Top 3 */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {classementGeneral.slice(0, 3).map((user, index) => (
            <div
              key={user.rang}
              className={`border border-black/10 rounded-lg p-6 text-center ${
                index === 0 ? "md:order-2 md:scale-105" : index === 1 ? "md:order-1" : "md:order-3"
              }`}
            >
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-10 w-10 ${getMedalColor(user.rang)}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {user.rang}
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-2">{user.nom}</h3>
              <p className="text-2xl font-bold mb-4">{user.points.toLocaleString()} pts</p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/10">
                <div>
                  <p className="text-sm text-black/60">Quiz</p>
                  <p className="font-semibold">{user.quizCompletes}</p>
                </div>
                <div>
                  <p className="text-sm text-black/60">Réussite</p>
                  <p className="font-semibold">{user.tauxReussite}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reste du classement */}
        <div className="space-y-2">
          {classementGeneral.slice(3).map((user) => (
            <div
              key={user.rang}
              className="border border-black/10 rounded-lg p-4 hover:border-black/30 transition-all"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center font-bold text-sm">
                    #{user.rang}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{user.nom}</h3>
                    <p className="text-sm text-black/60">{user.points.toLocaleString()} points</p>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm text-black/60">
                  <div>
                    <span className="font-semibold text-black">{user.quizCompletes}</span> quiz
                  </div>
                  <div>
                    <span className="font-semibold text-black">{user.tauxReussite}%</span> réussite
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
