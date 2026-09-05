"use client";
import { useState } from "react";

export default function ContribuerPage() {
  const [typeRessource, setTypeRessource] = useState("livre");
  const [formData, setFormData] = useState({
    titre: "",
    auteur: "",
    matiere: "",
    niveau: "",
    description: "",
    fichier: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de soumission
    console.log("Soumission:", { typeRessource, ...formData });
    alert("Merci pour votre contribution ! Elle sera examinée par notre équipe.");
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="border-b border-black/10 bg-gradient-to-br from-black/5 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-5xl font-bold mb-4">Contribuer</h1>
          <p className="text-black/60 text-lg">
            Partagez vos ressources académiques et aidez la communauté étudiante à réussir
          </p>
        </div>
      </div>

      {/* Stats de contribution */}
      <div className="border-b border-black/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold mb-1">1,234</p>
              <p className="text-sm text-black/60">Contributions</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">567</p>
              <p className="text-sm text-black/60">Contributeurs</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">50K+</p>
              <p className="text-sm text-black/60">Téléchargements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-black/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Nouvelle contribution</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type de ressource */}
            <div>
              <label className="block text-sm font-medium mb-2">Type de ressource *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: "livre", label: "Livre" },
                  { value: "cours", label: "Cours" },
                  { value: "sujet", label: "Sujet" },
                  { value: "correction", label: "Correction" },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setTypeRessource(type.value)}
                    className={`px-4 py-3 border rounded-md text-sm font-medium transition-all ${
                      typeRessource === type.value
                        ? "bg-black text-white border-black"
                        : "bg-white border-black/10 hover:border-black/30"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Titre */}
            <div>
              <label htmlFor="titre" className="block text-sm font-medium mb-2">
                Titre *
              </label>
              <input
                type="text"
                id="titre"
                required
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
                placeholder="Ex: Mathématiques - Algèbre Linéaire"
              />
            </div>

            {/* Auteur */}
            <div>
              <label htmlFor="auteur" className="block text-sm font-medium mb-2">
                Auteur *
              </label>
              <input
                type="text"
                id="auteur"
                required
                value={formData.auteur}
                onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
                placeholder="Nom de l'auteur"
              />
            </div>

            {/* Matière et Niveau */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="matiere" className="block text-sm font-medium mb-2">
                  Matière *
                </label>
                <select
                  id="matiere"
                  required
                  value={formData.matiere}
                  onChange={(e) => setFormData({ ...formData, matiere: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
                >
                  <option value="">Sélectionner une matière</option>
                  <option value="mathematiques">Mathématiques</option>
                  <option value="physique">Physique</option>
                  <option value="informatique">Informatique</option>
                  <option value="economie">Économie</option>
                  <option value="chimie">Chimie</option>
                  <option value="droit">Droit</option>
                </select>
              </div>

              <div>
                <label htmlFor="niveau" className="block text-sm font-medium mb-2">
                  Niveau *
                </label>
                <select
                  id="niveau"
                  required
                  value={formData.niveau}
                  onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors"
                >
                  <option value="">Sélectionner un niveau</option>
                  <option value="licence1">Licence 1</option>
                  <option value="licence2">Licence 2</option>
                  <option value="licence3">Licence 3</option>
                  <option value="master1">Master 1</option>
                  <option value="master2">Master 2</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-black/10 rounded-md focus:outline-none focus:border-black/30 transition-colors resize-none"
                placeholder="Décrivez brièvement le contenu de la ressource..."
              />
            </div>

            {/* Upload fichier */}
            <div>
              <label htmlFor="fichier" className="block text-sm font-medium mb-2">
                Fichier *
              </label>
              <div className="border-2 border-dashed border-black/10 rounded-lg p-8 text-center hover:border-black/30 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto mb-4 text-black/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <input
                  type="file"
                  id="fichier"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, fichier: e.target.files?.[0] || null })
                  }
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                />
                <label
                  htmlFor="fichier"
                  className="cursor-pointer text-sm text-black/60 hover:text-black transition-colors"
                >
                  <span className="font-medium">Cliquez pour télécharger</span> ou glissez-déposez
                  <br />
                  PDF, DOC, DOCX, PPT, PPTX (Max. 50MB)
                </label>
                {formData.fichier && (
                  <p className="mt-4 text-sm font-medium text-black">
                    Fichier sélectionné: {formData.fichier.name}
                  </p>
                )}
              </div>
            </div>

            {/* Conditions */}
            <div className="bg-black/5 border border-black/10 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" required className="mt-1" />
                <span className="text-sm text-black/60">
                  Je certifie que je dispose des droits nécessaires pour partager ce contenu et
                  j&apos;accepte les{" "}
                  <a href="#" className="text-black underline">
                    conditions d&apos;utilisation
                  </a>
                </span>
              </label>
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-black/90 transition-all"
              >
                Soumettre la contribution
              </button>
              <button
                type="button"
                className="px-6 py-3 border border-black/20 rounded-md hover:bg-black/5 transition-all"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>

        {/* Avantages de contribuer */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center mx-auto mb-4">
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Aidez la communauté</h3>
            <p className="text-sm text-black/60">
              Vos ressources aident des milliers d&apos;étudiants à réussir
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center mx-auto mb-4">
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
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Gagnez des points</h3>
            <p className="text-sm text-black/60">
              Montez dans le classement et débloquez des badges
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center mx-auto mb-4">
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
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Construisez votre CV</h3>
            <p className="text-sm text-black/60">
              Valorisez votre profil avec vos contributions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
