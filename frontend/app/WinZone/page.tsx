"use client";
import { useState } from "react";

// Types
interface Objectif {
  id: number;
  titre: string;
  matiere: string;
  dateDebut: string;
  dateEcheance: string;
  progression: number;
  statut: "en_cours" | "termine" | "en_retard";
}

interface MatiereATravailler {
  id: number;
  nom: string;
  filiere: string;
  niveau: string;
  heuresEtudiees: number;
  objectifHeures: number;
  dernierAcces: string;
}

interface SujetRecommande {
  id: number;
  titre: string;
  matiere: string;
  niveau: string;
  annee: string;
  pertinence: number;
  raison: string;
}

interface Defi {
  id: number;
  titre: string;
  description: string;
  type: "quotidien" | "hebdomadaire" | "mensuel";
  points: number;
  progression: number;
  objectif: number;
  expire: string;
}

// Données de démonstration
const objectifs: Objectif[] = [];
const matieres: MatiereATravailler[] = [];
const sujetsRecommandes: SujetRecommande[] = [];
const defis: Defi[] = [];

export default function WinZonePage() {
  const [ongletActif, setOngletActif] = useState<"objectifs" | "matieres" | "progression" | "sujets" | "defis">("objectifs");

  // Statistiques générales
  const statsGenerales = {
    heuresTotal: matieres.reduce((acc, m) => acc + m.heuresEtudiees, 0),
    objectifsTermines: objectifs.filter(o => o.statut === "termine").length,
    objectifsTotal: objectifs.length,
    defisTermines: defis.filter(d => d.progression >= d.objectif).length,
    defisTotal: defis.length,
    progressionMoyenne: objectifs.length > 0 
      ? Math.round(objectifs.reduce((acc, o) => acc + o.progression, 0) / objectifs.length) 
      : 0
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "termine":
        return "bg-green-100 text-green-800";
      case "en_cours":
        return "bg-blue-100 text-blue-800";
      case "en_retard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-black/5";
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case "termine":
        return "Terminé";
      case "en_cours":
        return "En cours";
      case "en_retard":
        return "En retard";
      default:
        return statut;
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="border-b border-black/10 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-4">WinZone</h1>
              <p className="text-black/60 text-lg max-w-2xl">
                Un espace consacré à la préparation et à la réussite. Suivez vos objectifs, gérez vos matières et relevez des défis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="border-b border-black/10 bg-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="bg-white border border-black/10 rounded-lg p-4">
              <p className="text-2xl font-bold mb-1">{statsGenerales.heuresTotal}h</p>
              <p className="text-xs text-black/60">Heures d&apos;étude</p>
            </div>
            <div className="bg-white border border-black/10 rounded-lg p-4">
              <p className="text-2xl font-bold mb-1">{statsGenerales.objectifsTermines}/{statsGenerales.objectifsTotal}</p>
              <p className="text-xs text-black/60">Objectifs réalisés</p>
            </div>
            <div className="bg-white border border-black/10 rounded-lg p-4">
              <p className="text-2xl font-bold mb-1">{statsGenerales.progressionMoyenne}%</p>
              <p className="text-xs text-black/60">Progression moyenne</p>
            </div>
            <div className="bg-white border border-black/10 rounded-lg p-4">
              <p className="text-2xl font-bold mb-1">{matieres.length}</p>
              <p className="text-xs text-black/60">Matières actives</p>
            </div>
            <div className="bg-white border border-black/10 rounded-lg p-4">
              <p className="text-2xl font-bold mb-1">{statsGenerales.defisTermines}/{statsGenerales.defisTotal}</p>
              <p className="text-xs text-black/60">Défis complétés</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setOngletActif("objectifs")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                ongletActif === "objectifs"
                  ? "border-black text-black"
                  : "border-transparent text-black/60 hover:text-black/80"
              }`}
            >
               Objectifs de révision
            </button>
            <button
              onClick={() => setOngletActif("matieres")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                ongletActif === "matieres"
                  ? "border-black text-black"
                  : "border-transparent text-black/60 hover:text-black/80"
              }`}
            >
               Matières à travailler
            </button>
            <button
              onClick={() => setOngletActif("progression")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                ongletActif === "progression"
                  ? "border-black text-black"
                  : "border-transparent text-black/60 hover:text-black/80"
              }`}
            >
               Progression
            </button>
            <button
              onClick={() => setOngletActif("sujets")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                ongletActif === "sujets"
                  ? "border-black text-black"
                  : "border-transparent text-black/60 hover:text-black/80"
              }`}
            >
               Sujets recommandés
            </button>
            <button
              onClick={() => setOngletActif("defis")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                ongletActif === "defis"
                  ? "border-black text-black"
                  : "border-transparent text-black/60 hover:text-black/80"
              }`}
            >
               Défis étudiants
            </button>
          </div>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Objectifs de révision */}
        {ongletActif === "objectifs" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Mes objectifs de révision</h2>
              <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-black/90 transition-all">
                + Nouvel objectif
              </button>
            </div>

            {objectifs.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-black/20 rounded-lg">
                <p className="text-black/60 mb-4">Aucun objectif défini pour le moment</p>
                <p className="text-sm text-black/40 mb-6">Commencez par créer votre premier objectif de révision</p>
                <button className="px-6 py-3 bg-black text-white text-sm font-medium rounded-md hover:bg-black/90 transition-all">
                  Créer mon premier objectif
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {objectifs.map((objectif) => (
                  <div
                    key={objectif.id}
                    className="border border-black/10 rounded-lg p-6 hover:border-black/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{objectif.titre}</h3>
                        <div className="flex items-center gap-3 text-sm text-black/60">
                          <span>{objectif.matiere}</span>
                          <span>•</span>
                          <span>Du {objectif.dateDebut} au {objectif.dateEcheance}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full ${getStatutColor(objectif.statut)}`}>
                        {getStatutLabel(objectif.statut)}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-black/60">Progression</span>
                        <span className="font-medium">{objectif.progression}%</span>
                      </div>
                      <div className="w-full bg-black/5 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-black h-full transition-all"
                          style={{ width: `${objectif.progression}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Matières à travailler */}
        {ongletActif === "matieres" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Matières à travailler</h2>
              <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-black/90 transition-all">
                + Ajouter une matière
              </button>
            </div>

            {matieres.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-black/20 rounded-lg">
                <div className="text-4xl mb-4">📚</div>
                <p className="text-black/60 mb-4">Aucune matière ajoutée</p>
                <p className="text-sm text-black/40 mb-6">Ajoutez les matières que vous souhaitez travailler</p>
                <button className="px-6 py-3 bg-black text-white text-sm font-medium rounded-md hover:bg-black/90 transition-all">
                  Ajouter ma première matière
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matieres.map((matiere) => (
                  <div
                    key={matiere.id}
                    className="border border-black/10 rounded-lg p-6 hover:border-black/30 transition-all hover:shadow-lg"
                  >
                    <h3 className="font-semibold text-lg mb-3">{matiere.nom}</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-black/5 text-xs rounded-md">{matiere.filiere}</span>
                      <span className="px-2 py-1 bg-black/5 text-xs rounded-md">{matiere.niveau}</span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-black/60">Heures étudiées</span>
                        <span className="font-medium">
                          {matiere.heuresEtudiees}h / {matiere.objectifHeures}h
                        </span>
                      </div>
                      <div className="w-full bg-black/5 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-black h-full transition-all"
                          style={{ 
                            width: `${Math.min((matiere.heuresEtudiees / matiere.objectifHeures) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-black/40">
                      Dernier accès: {matiere.dernierAcces}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Progression */}
        {ongletActif === "progression" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Ma progression</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="border border-black/10 rounded-lg p-6">
                <h3 className="font-semibold mb-4">Progression par matière</h3>
                {matieres.length === 0 ? (
                  <p className="text-black/40 text-sm">Aucune donnée disponible</p>
                ) : (
                  <div className="space-y-4">
                    {matieres.map((matiere) => {
                      const progression = Math.min((matiere.heuresEtudiees / matiere.objectifHeures) * 100, 100);
                      return (
                        <div key={matiere.id}>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>{matiere.nom}</span>
                            <span className="font-medium">{Math.round(progression)}%</span>
                          </div>
                          <div className="w-full bg-black/5 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-black h-full transition-all"
                              style={{ width: `${progression}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="border border-black/10 rounded-lg p-6">
                <h3 className="font-semibold mb-4">Objectifs en cours</h3>
                {objectifs.filter(o => o.statut === "en_cours").length === 0 ? (
                  <p className="text-black/40 text-sm">Aucun objectif en cours</p>
                ) : (
                  <div className="space-y-3">
                    {objectifs
                      .filter(o => o.statut === "en_cours")
                      .slice(0, 5)
                      .map((objectif) => (
                        <div key={objectif.id} className="pb-3 border-b border-black/10 last:border-0">
                          <p className="text-sm font-medium mb-2">{objectif.titre}</p>
                          <div className="w-full bg-black/5 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-black h-full transition-all"
                              style={{ width: `${objectif.progression}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="text-center py-12 border border-dashed border-black/20 rounded-lg">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-black/60">Graphiques détaillés à venir</p>
              <p className="text-sm text-black/40 mt-2">
                Visualisez votre progression avec des graphiques interactifs
              </p>
            </div>
          </div>
        )}

        {/* Sujets recommandés */}
        {ongletActif === "sujets" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Sujets recommandés pour vous</h2>

            {sujetsRecommandes.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-black/20 rounded-lg">
                <div className="text-4xl mb-4">💡</div>
                <p className="text-black/60 mb-4">Aucun sujet recommandé pour le moment</p>
                <p className="text-sm text-black/40">
                  Les recommandations apparaîtront en fonction de vos objectifs et de votre progression
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sujetsRecommandes.map((sujet) => (
                  <div
                    key={sujet.id}
                    className="border border-black/10 rounded-lg p-6 hover:border-black/30 transition-all hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📄</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{sujet.titre}</h3>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-yellow-500">★</span>
                            <span>{sujet.pertinence}% pertinent</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-black/60 mb-3">
                          <span>{sujet.matiere}</span>
                          <span>•</span>
                          <span>{sujet.niveau}</span>
                          <span>•</span>
                          <span>{sujet.annee}</span>
                        </div>

                        <p className="text-sm text-black/60 mb-4">
                          💡 <span className="italic">{sujet.raison}</span>
                        </p>

                        <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-black/90 transition-all">
                          Voir le sujet
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Défis étudiants */}
        {ongletActif === "defis" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Défis étudiants</h2>

            {defis.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-black/20 rounded-lg">
                <div className="text-4xl mb-4">🏆</div>
                <p className="text-black/60 mb-4">Aucun défi disponible</p>
                <p className="text-sm text-black/40">
                  Les défis vous permettront de gagner des points et de rester motivé
                </p>
              </div>
            ) : (
              <div>
                {/* Défis quotidiens */}
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-4">🌅 Défis quotidiens</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {defis
                      .filter(d => d.type === "quotidien")
                      .map((defi) => (
                        <div
                          key={defi.id}
                          className="border border-black/10 rounded-lg p-5 hover:border-black/30 transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{defi.titre}</h4>
                              <p className="text-sm text-black/60">{defi.description}</p>
                            </div>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                              +{defi.points} pts
                            </span>
                          </div>

                          <div className="mb-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-black/60">Progression</span>
                              <span className="font-medium">
                                {defi.progression}/{defi.objectif}
                              </span>
                            </div>
                            <div className="w-full bg-black/5 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full transition-all"
                                style={{ 
                                  width: `${Math.min((defi.progression / defi.objectif) * 100, 100)}%` 
                                }}
                              />
                            </div>
                          </div>

                          <p className="text-xs text-black/40">Expire: {defi.expire}</p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Défis hebdomadaires */}
                {defis.filter(d => d.type === "hebdomadaire").length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-semibold text-lg mb-4">📅 Défis hebdomadaires</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {defis
                        .filter(d => d.type === "hebdomadaire")
                        .map((defi) => (
                          <div
                            key={defi.id}
                            className="border border-black/10 rounded-lg p-5 hover:border-black/30 transition-all"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">{defi.titre}</h4>
                                <p className="text-sm text-black/60">{defi.description}</p>
                              </div>
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                +{defi.points} pts
                              </span>
                            </div>

                            <div className="mb-2">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-black/60">Progression</span>
                                <span className="font-medium">
                                  {defi.progression}/{defi.objectif}
                                </span>
                              </div>
                              <div className="w-full bg-black/5 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-full transition-all"
                                  style={{ 
                                    width: `${Math.min((defi.progression / defi.objectif) * 100, 100)}%` 
                                  }}
                                />
                              </div>
                            </div>

                            <p className="text-xs text-black/40">Expire: {defi.expire}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Défis mensuels */}
                {defis.filter(d => d.type === "mensuel").length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-4">🗓️ Défis mensuels</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {defis
                        .filter(d => d.type === "mensuel")
                        .map((defi) => (
                          <div
                            key={defi.id}
                            className="border border-black/10 rounded-lg p-5 hover:border-black/30 transition-all"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">{defi.titre}</h4>
                                <p className="text-sm text-black/60">{defi.description}</p>
                              </div>
                              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                                +{defi.points} pts
                              </span>
                            </div>

                            <div className="mb-2">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-black/60">Progression</span>
                                <span className="font-medium">
                                  {defi.progression}/{defi.objectif}
                                </span>
                              </div>
                              <div className="w-full bg-black/5 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-purple-400 to-purple-600 h-full transition-all"
                                  style={{ 
                                    width: `${Math.min((defi.progression / defi.objectif) * 100, 100)}%` 
                                  }}
                                />
                              </div>
                            </div>

                            <p className="text-xs text-black/40">Expire: {defi.expire}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
